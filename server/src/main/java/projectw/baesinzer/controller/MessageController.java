package projectw.baesinzer.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;
import projectw.baesinzer.domain.Message;

@Controller
@RequiredArgsConstructor
public class MessageController {

    private final SimpMessageSendingOperations operations;

    @MessageMapping("socket/message")
    public void sendMessage(Message message) {
        operations.convertAndSend("/sub/socket/room/" + message.getRoomId(), message);
    }
}
