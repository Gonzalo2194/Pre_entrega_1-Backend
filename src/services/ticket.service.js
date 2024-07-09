const TicketModel = require('../models/ticket.model.js');


class TicketService {
    async crearTicket(ticketData) {
        try {
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
