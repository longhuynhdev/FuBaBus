package org.example.mdmprojectserver.mongodb.repository;

import org.example.mdmprojectserver.mongodb.model.Ticket;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TicketRepository extends MongoRepository<Ticket, String>{
}
