const winston = require("winston");

const niveles = {
    nivel: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colores: {
        fatal: "red",
        error: "yellow",
        warning: "blue",
        info: "green",
        http: "magenta",
        debug: "white"
    }
}
class AddLogger {
    constructor() {
        this.loggerProduccion = this.configurarLoggerProduccion();
        this.loggerDesarrollo = this.configurarLoggerDesarrollo();
        this.logger = process.env.NODE_ENV === 'production' ? this.loggerProduccion : this.loggerDesarrollo;
    }

    configurarLoggerDesarrollo() {
        return winston.createLogger({
            levels: niveles.nivel,
            transports: [
                new winston.transports.Console({
                    level: "debug",
                    format: winston.format.combine( 
                        winston.format.colorize({colors: niveles.colores}),
                        winston.format.simple()
                    )
                }),
            ]
        });
    }

    configurarLoggerProduccion() {
        return winston.createLogger({
            levels: niveles.nivel,
            transports: [
                new winston.transports.Console({
                    level: 'info',
                    format: winston.format.combine( 
                        winston.format.colorize({colors: niveles.colores}),
                        winston.format.simple()
                    )
                }),
                new winston.transports.File({
                    filename: './errors.log',
                    level: "error",
                    format: winston.format.simple()
                }),
            ]
        });
    }


    middleware() {
        return (req, res, next) => {
            req.logger = this.logger;
            req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`);
            next();
        };
    }
}

module.exports = new AddLogger();