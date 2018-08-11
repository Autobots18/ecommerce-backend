import { Request, ResponseToolkit, ResponseObject } from 'hapi';
import BaseController from '../helpers/base-controller';
import { GET, POST, PATCH, DELETE } from '../decorators/controller';
import CategoryModel from '../models/category';
import logger from '../helpers/logger';


class Category extends BaseController {
  constructor() {
    super('/api/categories');
  }

  @GET('/', {
    description: 'Get all categories',
    tags: ['api']
  })
  async getAllCategories(request: Request, h: ResponseToolkit) {
    try {
      const categories = await CategoryModel.find();

      return h.response({
        categories
      })
      .code(200);
    } catch (err) {
      logger.error('Unable to get all categories', err);
      return h.response({
        message: 'Unable to get all categories'
      })
      .code(400);
    }
  }

  @POST('/', {
    description: 'Create a category',
    tags: ['api']
  })
  async createCategory(request: Request, h: ResponseToolkit) {
    try {
      const {
        name
      } = request.payload;

      // TODO: Create slug from name
      const slug = '';

      const category = await CategoryModel.create({
        name,
        slug
      });

      if (!category) {
        throw new Error('Unable to create category');
      }

      return h.response({
        category
      })
      .code(201);
    } catch (err) {
      logger.error('Unable to create category', err);
      return h.response({
        message: 'Unable to create category'
      })
      .code(400);
    }
  }

  @GET('/{id}', {
    description: 'Get a category by id',
    tags: ['api']
  })
  async getCategoryById(request: Request, h: ResponseToolkit) {
    try {
      const {
        id
      } = request.params;

      const category = await CategoryModel.findById(id);

      if (!category) {
        throw new Error('Invalid category id');
      }

      return h.response({
        category
      })
      .code(200);
    } catch (err) {
      logger.error('Unable to get category by id', err);
      return h.response({
        message: 'Invalid category id'
      })
      .code(400);
    }
  }

  @GET('/by_slug/{slug}', {
    description: 'Get a category by slug',
    tags: ['api']
  })
  async getCategoryBySlug(request: Request, h: ResponseToolkit) {
    try {
      const {
        slug
      } = request.params;

      const category = await CategoryModel.findOne({
        slug
      });

      if (!category) {
        throw new Error('Invalid category slug');
      }

      return h.response({
        category
      })
      .code(200);
    } catch (err) {
      logger.error('Unable to get category by slug', err);
      return h.response({
        message: 'Invalid category slug'
      })
      .code(400);
    }
  }

  @GET('/by_name/{name}', {
    description: 'Get a category by name',
    tags: ['api']
  })
  async getCategoryByName(request: Request, h: ResponseToolkit) {
    try {
      const {
        name
      } = request.params;
      // TODO: Create slug from name
      const slug = name;

      // TODO: Call endpoint for getting category by slug internally

      const category = 'category';

      if (!category) {
        throw new Error('Invalid category name');
      }

      return h.response({
        category
      })
      .code(200);
    } catch (err) {
      logger.error('Unable to get category by name', err);
      return h.response({
        message: 'Invalid category name'
      })
      .code(400);
    }
  }

  @PATCH('/{id}', {
    description: 'Update a category',
    tags: ['api']
  })
  async updateCategory(request: Request, h: ResponseToolkit) {
    try {
      const {
        id
      } = request.params;

      const {
        name
      } = request.payload;

      // TODO: Create slug from name
      const slug = '';

      const category = await CategoryModel.findByIdAndUpdate(id, { name, slug }, { new: true });

      if (!category) {
        throw new Error('Unable to update category');
      }

      return h.response({
        category
      })
      .code(200);
    } catch (err) {
      logger.error('Unable to update category', err);
      return h.response({
        message: 'Unable to update category'
      })
      .code(400);
    }
  }

  @DELETE('/{id}', {
    description: 'Delete a category',
    tags: ['api']
  })
  async deleteCategory(request: Request, h: ResponseToolkit) {
    try {
      const {
        id
      } = request.params;

      const response = await CategoryModel.findByIdAndRemove(id);

      // TODO: Check the appropriate response object
      if (!response) {
        throw new Error('Unable to delete category');
      }

      return h.response({
        message: 'Category has been deleted'
      })
      .code(200);
    } catch (err) {
      logger.error('Unable to delete category', err);
      return h.response({
        message: 'Unable to delete category'
      })
      .code(400);
    }
  }
}
