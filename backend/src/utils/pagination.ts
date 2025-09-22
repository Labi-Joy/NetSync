import { Request } from 'express';
import { Document, Model, FilterQuery, PipelineStage } from 'mongoose';

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sort?: string;
  sortOrder?: 'asc' | 'desc';
  defaultLimit?: number;
  maxLimit?: number;
}

export interface PaginationQuery {
  page: number;
  limit: number;
  skip: number;
  sort: Record<string, 1 | -1>;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage: number | null;
    prevPage: number | null;
    startIndex: number;
    endIndex: number;
  };
  meta?: {
    query: Record<string, any>;
    sortBy: string;
    sortOrder: string;
    executionTime?: number;
  };
}

export interface AggregationPaginationResult<T> extends PaginationResult<T> {
  aggregationStats?: {
    pipeline: PipelineStage[];
    matchedCount: number;
    processedCount: number;
  };
}

export class PaginationHelper {
  /**
   * Parse pagination parameters from request query
   */
  static parseQuery(req: Request, options: PaginationOptions = {}): PaginationQuery {
    const {
      defaultLimit = 20,
      maxLimit = 100,
      sort = 'createdAt',
      sortOrder = 'desc'
    } = options;

    // Parse page (1-indexed)
    const page = Math.max(1, parseInt(req.query.page as string) || 1);

    // Parse limit with bounds checking
    let limit = parseInt(req.query.limit as string) || defaultLimit;
    limit = Math.min(Math.max(1, limit), maxLimit);

    // Calculate skip
    const skip = (page - 1) * limit;

    // Parse sort
    const sortField = (req.query.sort as string) || sort;
    const sortDirection = (req.query.sortOrder as string) || sortOrder;
    const sortObj: Record<string, 1 | -1> = {
      [sortField]: sortDirection === 'asc' ? 1 : -1
    };

    return {
      page,
      limit,
      skip,
      sort: sortObj
    };
  }

  /**
   * Execute paginated query for Mongoose models
   */
  static async paginate<T extends Document>(
    model: Model<T>,
    filter: FilterQuery<T>,
    pagination: PaginationQuery,
    options: {
      populate?: any;
      select?: string;
      lean?: boolean;
    } = {}
  ): Promise<PaginationResult<any>> {
    const startTime = Date.now();

    const { populate, select, lean = false } = options;
    const { page, limit, skip, sort } = pagination;

    // Execute count and data queries in parallel
    const [totalItems, data] = await Promise.all([
      model.countDocuments(filter),
      model
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate(populate || '')
        .select(select || '')
        .lean(lean)
    ]);

    const executionTime = Date.now() - startTime;

    return this.buildPaginationResult(data, totalItems, pagination, {
      executionTime,
      sortBy: Object.keys(sort)[0],
      sortOrder: Object.values(sort)[0] === 1 ? 'asc' : 'desc'
    });
  }

  /**
   * Execute paginated aggregation query
   */
  static async paginateAggregation<T>(
    model: Model<any>,
    pipeline: PipelineStage[],
    pagination: PaginationQuery,
    options: {
      countPipeline?: PipelineStage[];
    } = {}
  ): Promise<AggregationPaginationResult<T>> {
    const startTime = Date.now();
    const { page, limit, skip, sort } = pagination;

    // Create count pipeline
    const countPipeline = options.countPipeline || [
      ...pipeline,
      { $count: 'total' }
    ];

    // Create data pipeline
    const dataPipeline = [
      ...pipeline,
      { $sort: sort },
      { $skip: skip },
      { $limit: limit }
    ];

    // Execute both pipelines in parallel
    const [countResult, data] = await Promise.all([
      model.aggregate(countPipeline),
      model.aggregate(dataPipeline)
    ]);

    const totalItems = countResult[0]?.total || 0;
    const executionTime = Date.now() - startTime;

    const result = this.buildPaginationResult(data, totalItems, pagination, {
      executionTime,
      sortBy: Object.keys(sort)[0],
      sortOrder: Object.values(sort)[0] === 1 ? 'asc' : 'desc'
    }) as AggregationPaginationResult<T>;

    result.aggregationStats = {
      pipeline: dataPipeline,
      matchedCount: totalItems,
      processedCount: data.length
    };

    return result;
  }

  /**
   * Paginate array data (for in-memory pagination)
   */
  static paginateArray<T>(
    data: T[],
    pagination: PaginationQuery
  ): PaginationResult<T> {
    const { page, limit, skip } = pagination;
    const totalItems = data.length;
    const paginatedData = data.slice(skip, skip + limit);

    return this.buildPaginationResult(paginatedData, totalItems, pagination);
  }

  /**
   * Build standardized pagination result
   */
  private static buildPaginationResult<T>(
    data: T[],
    totalItems: number,
    pagination: PaginationQuery,
    meta?: {
      executionTime?: number;
      sortBy?: string;
      sortOrder?: string;
      query?: Record<string, any>;
    }
  ): PaginationResult<T> {
    const { page, limit } = pagination;
    const totalPages = Math.ceil(totalItems / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    const startIndex = (page - 1) * limit + 1;
    const endIndex = Math.min(startIndex + data.length - 1, totalItems);

    return {
      data,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
        hasNextPage,
        hasPrevPage,
        nextPage: hasNextPage ? page + 1 : null,
        prevPage: hasPrevPage ? page - 1 : null,
        startIndex: totalItems > 0 ? startIndex : 0,
        endIndex: totalItems > 0 ? endIndex : 0
      },
      meta: meta ? {
        sortBy: meta.sortBy || 'unknown',
        sortOrder: meta.sortOrder || 'desc',
        query: meta.query || {},
        executionTime: meta.executionTime
      } : undefined
    };
  }

  /**
   * Generate pagination links for REST API
   */
  static generateLinks(
    baseUrl: string,
    pagination: PaginationResult<any>['pagination'],
    queryParams: Record<string, any> = {}
  ): {
    self: string;
    first: string;
    last: string;
    next?: string;
    prev?: string;
  } {
    const buildUrl = (page: number) => {
      const params = new URLSearchParams({
        ...queryParams,
        page: page.toString()
      });
      return `${baseUrl}?${params.toString()}`;
    };

    const links = {
      self: buildUrl(pagination.currentPage),
      first: buildUrl(1),
      last: buildUrl(pagination.totalPages)
    };

    if (pagination.hasNextPage && pagination.nextPage) {
      (links as any).next = buildUrl(pagination.nextPage);
    }

    if (pagination.hasPrevPage && pagination.prevPage) {
      (links as any).prev = buildUrl(pagination.prevPage);
    }

    return links;
  }

  /**
   * Create cursor-based pagination for real-time data
   */
  static async paginateCursor<T extends Document>(
    model: Model<T>,
    filter: FilterQuery<T>,
    options: {
      cursor?: string;
      limit?: number;
      sortField?: string;
      sortOrder?: 'asc' | 'desc';
      populate?: any;
      select?: string;
    } = {}
  ): Promise<{
    data: T[];
    hasNextPage: boolean;
    nextCursor?: string;
    totalCount?: number;
  }> {
    const {
      cursor,
      limit = 20,
      sortField = 'createdAt',
      sortOrder = 'desc',
      populate,
      select
    } = options;

    let query = model.find(filter);

    // Apply cursor filtering
    if (cursor) {
      const cursorFilter = sortOrder === 'desc'
        ? { [sortField]: { $lt: cursor } }
        : { [sortField]: { $gt: cursor } };
      query = query.where(cursorFilter);
    }

    // Apply sorting, limiting, and population
    const sortObj: any = { [sortField]: sortOrder === 'desc' ? -1 : 1 };
    query = query
      .sort(sortObj)
      .limit(limit + 1) // Get one extra to check if there's a next page
      .populate(populate || '')
      .select(select || '');

    const results = await query;
    const hasNextPage = results.length > limit;

    // Remove the extra item if it exists
    if (hasNextPage) {
      results.pop();
    }

    // Get next cursor from the last item
    const nextCursor = hasNextPage && results.length > 0
      ? results[results.length - 1][sortField]
      : undefined;

    return {
      data: results,
      hasNextPage,
      nextCursor,
    };
  }
}

export default PaginationHelper;