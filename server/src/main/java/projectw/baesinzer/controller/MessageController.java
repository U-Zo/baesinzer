package projectw.baesinzer.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
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
    public void sendMessage(Message message, SimpMessageHeaderAccessor headerAccessor) {
        UserInfo userInfo = message.getUserInfo();
        Room room = roomService.findOne(message.getRoomCode());

        switch (message.getType()) { // 메시지 타입 검사
            case JOIN: // 방 입장
                message.setMessage(userInfo.getUsername() + "님이 입장하셨습니다.");

                // 최대 6명 까지 할당 번호 검사하여 없으면 할당
                for (int i = 1; i <= 6; i++) {
                    if (room.getUsers().get(i) == null) {
                        room.getUsers().put(i, userInfo);
                        userInfo.setUserNo(i);
                        room.setCount(room.getUsers().size());

                        headerAccessor.getSessionAttributes().put("user", userInfo);
                        headerAccessor.getSessionAttributes().put("roomCode", message.getRoomCode());
                        break;
                    }
                }
                break;
            case VOTE:
                int userNo = userInfo.getHasVoted();
                UserInfo votedUserInfo = room.getUsers().get(userNo);
                votedUserInfo.setVotedNum(votedUserInfo.getVotedNum() + 1);
                break;
            case EXIT:
                room.getUsers().remove(userInfo.getUserNo());
                room.setCount(room.getUsers().size());

                // 방의 인원이 0이 되면 방 목록에서 삭제
                if (room.getUsers().size() == 0) {
                    roomService.removeRoom(room);
                    break;
                }

                headerAccessor.getSessionAttributes().remove("user");
                headerAccessor.getSessionAttributes().remove("room");

                message.setMessage(userInfo.getUsername() + "님이 퇴장하셨습니다.");
                break;
        }

        operations.convertAndSend("/sub/socket/room/" + room.getRoomCode(), message);
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());

        UserInfo userInfo = (UserInfo) headerAccessor.getSessionAttributes().get("user");
        String roomCode = (String) headerAccessor.getSessionAttributes().get("roomCode");

        Room room = roomService.findOne(roomCode);
        if (userInfo != null) {
            room.getUsers().remove(userInfo.getUserNo());
            room.setCount(room.getUsers().size());

            // 방의 인원이 0이 되면 방 목록에서 삭제
            if (room.getUsers().size() == 0) {
                roomService.removeRoom(room);
            }

            Message message = new Message();
            message.setUserInfo(userInfo);
            message.setType(Message.MessageType.EXIT);
            message.setMessage(userInfo.getUsername() + "님이 퇴장하셨습니다.");
            headerAccessor.getSessionAttributes().remove("user");
            headerAccessor.getSessionAttributes().remove("room");
            operations.convertAndSend("/sub/socket/room/" + roomCode, message);
        }
    }
}
