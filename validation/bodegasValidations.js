// import Joi from "joi";

// export const bodegasValidacion = (req, res, next) => {
//   console.log(req.body); 
//   const schema = Joi.object({
//     nombre: Joi.string().required(),
//     vinos: Joi.array().items(Joi.string().length(24).hex()).required(),
//     tags: Joi.array().items(Joi.string()).optional()
//   });

//   const { error } = schema.validate(req.body);
//   if (error) {
//     console.log(error.details);
//     return res.status(400).json({ error: error.details[0].message });
//   }

//   next();  
// };


import Joi from "joi";

export const bodegasValidacion = (req, res, next) => {
  console.log(req.body); // Depuración para verificar qué datos llegan

  const schema = Joi.object({
    nombre: Joi.string().required().messages({
      "string.empty": "El campo 'nombre' es obligatorio.",
    }),
    vinos: Joi.array()
      .items(Joi.string().length(24).hex())
      .required()
      .messages({
        "array.base": "El campo 'vinos' debe ser un array de IDs.",
        "string.length": "Cada ID de vino debe tener 24 caracteres.",
      }),
    tags: Joi.array().items(Joi.string()).optional(),
    cantidad: Joi.number()
      .integer()
      .min(0)
      .required()
      .messages({
        "number.base": "El campo 'cantidad' debe ser un número.",
        "number.min": "El campo 'cantidad' no puede ser negativo.",
      }),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    console.log(error.details); // Depuración para ver el detalle del error
    return res.status(400).json({ error: error.details[0].message });
  }

  next(); // Si no hay errores, pasa al siguiente middleware o controlador
};
