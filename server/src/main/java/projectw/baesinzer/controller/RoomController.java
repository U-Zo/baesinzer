package projectw.baesinzer.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.web.bind.annotation.RestController;
import projectw.baesinzer.domain.Message;

@RestController
@RequiredArgsConstructor
public class RoomController {

    private final SimpMessageSendingOperations operations;

    @MessageMapping("/message")
    public void sendMessage(Message message) {
        operations.convertAndSend("/sub/room/" + message.getRoomId(), message);
    }
}
