const TicketModel = require('../models/ticket.model.js');

class TicketService {
    async crearTicket(ticketData) {
        try {

            if (typeof ticketData.amount !== 'number' || isNaN(ticketData.amount)) {
                throw new Error('El campo amount debe ser un número válido');
            }

            const ticket = new TicketModel(ticketData);
            await ticket.save();
            return ticket;
        } catch (error) {
            console.error('Error al crear el ticket:', error);
            throw new Error('No se pudo crear el ticket en la base de datos');
        }
    }
}


module.exports = TicketService;
