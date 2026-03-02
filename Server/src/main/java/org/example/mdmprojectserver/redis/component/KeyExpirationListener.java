package org.example.mdmprojectserver.redis.component;

import org.example.mdmprojectserver.mongodb.model.Bus;
import org.example.mdmprojectserver.mongodb.repository.BusRepository;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

@Component
public class KeyExpirationListener implements MessageListener {

    private final BusRepository busRepository;
    private final RedisTemplate<String, String> redisTemplate;

    public KeyExpirationListener(BusRepository busRepository, @Lazy RedisTemplate<String, String> redisTemplate) {
        this.busRepository = busRepository;
        this.redisTemplate = redisTemplate;
    }

    @Override
    public void onMessage(Message message, byte[] pattern) {
        // Parse the expired key
        String expiredKey = message.toString();
        String[] parts = expiredKey.split(":");
        String busId = parts[0];
        String customerId = parts[1];
        System.out.println("Key expired: " + new String(message.getBody()));

        // Find the corresponding bus in MongoDB
        Bus bus = busRepository.findById(busId).orElse(null);
        if (bus != null) {
            // Revert the changes
            bus.getSeats().forEach(seat -> {
                if (seat.getCustomerId() != null && seat.getCustomerId().equals(customerId)) {
                    seat.setIsBooked(false);
                    seat.setCustomerId(null);
                }
            });
            busRepository.save(bus);
        }
    }
}