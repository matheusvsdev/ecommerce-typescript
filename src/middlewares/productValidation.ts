import Joi from "joi";

export const productSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().min(0).required(),
  categoryId: Joi.string().required(),
});
