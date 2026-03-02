package org.example.mdmprojectserver.redis.config;

import org.example.mdmprojectserver.redis.component.KeyExpirationListener;
import org.springframework.context.annotation.Bean;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.listener.PatternTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.data.redis.listener.Topic;
import org.springframework.stereotype.Component;

@Component
public class RedisKeyExpiration {
    private final RedisConnectionFactory redisConnectionFactory;
    private final KeyExpirationListener keyExpirationListener;

    public RedisKeyExpiration(RedisConnectionFactory redisConnectionFactory, KeyExpirationListener keyExpirationListener) {
        this.redisConnectionFactory = redisConnectionFactory;
        this.keyExpirationListener = keyExpirationListener;
    }

    @Bean
    RedisMessageListenerContainer keyExpirationListenerContainer() {
        RedisMessageListenerContainer listenerContainer = new RedisMessageListenerContainer();
        listenerContainer.setConnectionFactory(redisConnectionFactory);
        listenerContainer.addMessageListener(keyExpirationListener, topic());
        return listenerContainer;
    }

    @Bean
    Topic topic() {
        return new PatternTopic("__keyevent@0__:expired");
    }

}
