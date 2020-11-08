package projectw.baesinzer.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;
import projectw.baesinzer.domain.Message;
import projectw.baesinzer.domain.Room;
import projectw.baesinzer.domain.UserInfo;
import projectw.baesinzer.service.RoomService;

@Controller
@RequiredArgsConstructor
public class MessageController {

    private final RoomService roomService;
    private final SimpMessageSendingOperations operations;

    @MessageMapping("socket/message")
    public void sendMessage(Message message) {
        UserInfo userInfo = message.getUserInfo();
        Room room = roomService.findOne(message.getRoomCode());

        switch (message.getType()) { // 메시지 타입 검사
            case JOIN: // 방 입장
                message.setMessage(userInfo.getUsername() + "님이 입장하셨습니다.");

                // 최대 6명 까지 할당 번호 검사하여 없으면 할당
                for (int i = 0; i < 6; i++) {
                    if (room.getUsers().get(i) == null) {
                        room.getUsers().put(i, userInfo);
                        userInfo.setUserNo(i);
                        break;
                    }
                }
                break;
            case EXIT:
                room.getUsers().remove(userInfo.getUserNo());

                // 방의 인원이 0이 되면 방 목록에서 삭제
                if (room.getUsers().size() == 0) {
                    roomService.removeRoom(room);
                    break;
                }

                message.setMessage(userInfo.getUsername() + "님이 퇴장하셨습니다.");
                break;
        }

        operations.convertAndSend("/sub/socket/room/" + message.getRoomCode(), message);
    }
}
