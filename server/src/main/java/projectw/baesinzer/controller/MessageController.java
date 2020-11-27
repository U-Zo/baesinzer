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

import java.util.Random;
import java.util.Timer;
import java.util.TimerTask;

@Controller
@RequiredArgsConstructor
public class MessageController {

    private final RoomService roomService;
    private final SimpMessageSendingOperations operations;

    @MessageMapping("socket/message")
    public void sendMessage(Message message, SimpMessageHeaderAccessor headerAccessor) {
        UserInfo userInfo = message.getUserInfo();
        Room room = roomService.findOne(message.getRoomCode());
        UserInfo system = new UserInfo();
        system.setUsername("System");

        switch (message.getType()) { // 메시지 타입 검사
            case JOIN: // 방 입장
                message.setMessage(userInfo.getUsername() + "님이 입장하셨습니다.");

                // 최대 6명 까지 할당 번호 검사하여 없으면 할당
                for (int i = 1; i <= 6; i++) {
                    if (room.getCount() == 0) { // 방이 처음 만들어졌을 시 방장 설정
                        userInfo.setHost(true);
                    }

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
            case START:
                message.setUserInfo(system);
                message.setType(Message.MessageType.ROOM);
                message.setMessage("5초 뒤 게임이 시작됩니다.");
                Timer timer = new Timer();
                TimerTask timerTask = new TimerTask() {
                    int count = 4;

                    @Override
                    public void run() {
                        if (count > 0) {
                            message.setMessage(count + "초 뒤 게임이 시작됩니다.");
                            operations.convertAndSend("/sub/socket/room/" + room.getRoomCode(), message);
                            count--;
                        } else {
                            // 랜덤으로 baesinzer 선정
                            Random random = new Random();
                            while (true) {
                                int ranNum = random.nextInt(6) + 1; // 1 ~ 6까지 난수
                                UserInfo nextBaesinzer = room.getUsers().get(ranNum); // 난수에 해당하는 사용자
                                if (nextBaesinzer != null) { // 사용자가 존재하면
                                    nextBaesinzer.setBaesinzer(true); // baesinzer로 선정
                                    break;
                                }
                            }
                            room.setStart(true);
                            message.setMessage("게임이 시작되었습니다.");
                            operations.convertAndSend("/sub/socket/room/" + room.getRoomCode(), message);
                            timer.cancel();
                        }
                    }
                };

                timer.schedule(timerTask, 1000, 1000);
                break;
            case PLAY:
                room.getUsers().put(userInfo.getUserNo(), userInfo);
                break;
            case KILL:
                int killNo = userInfo.getKill();
                UserInfo deadUser = room.getUsers().get(killNo);
                deadUser.setDead(true);
                room.getUsers().put(userInfo.getUserNo(), userInfo);
                break;
            case VOTE_START:
                for (int i = 1; i <= 6; i++) {
                    room.getUsers().get(i).setHasVoted(0);
                    room.getUsers().get(i).setVotedNum(0);
                }
                break;
            case VOTE:
                int userNo = userInfo.getHasVoted();
                UserInfo votedUserInfo = room.getUsers().get(userNo);
                votedUserInfo.setVotedNum(votedUserInfo.getVotedNum() + 1);
                room.getUsers().put(userInfo.getUserNo(), userInfo);
                break;
            case EXIT:
                UserInfo _userInfo = (UserInfo) headerAccessor.getSessionAttributes().get("user");
                room.getUsers().remove(_userInfo.getUserNo());
                room.setCount(room.getUsers().size());

                // 방의 인원이 0이 되면 방 목록에서 삭제
                if (room.getUsers().size() == 0) {
                    roomService.removeRoom(room);
                    break;
                }

                if (_userInfo.isHost()) {
                    for (int i = 1; i <= 6; i++) {
                        UserInfo nextHost = room.getUsers().get(i);
                        System.out.println(nextHost);
                        if (nextHost != null) {
                            nextHost.setHost(true);
                            Message nextHostMessage = new Message();
                            nextHostMessage.setType(Message.MessageType.ROOM);
                            nextHostMessage.setUserInfo(system);
                            nextHostMessage.setMessage(nextHost.getUsername() + " 님이 방장이 되셨습니다.");
                            operations.convertAndSend("/sub/socket/room/" + room.getRoomCode(), nextHostMessage);
                            break;
                        }
                    }
                }

                headerAccessor.getSessionAttributes().remove("user");
                headerAccessor.getSessionAttributes().remove("room");

                message.setMessage(userInfo.getUsername() + "님이 퇴장하셨습니다.");
                break;
        }

        operations.convertAndSend("/sub/socket/room/" + room.getRoomCode(), message);

        System.out.println("메시지 보내고 나서");

        if (room.isStart()) {
            int alive = room.getCount() - 1;

            // 생존자 수 확인
            for (int i = 1; i <= 6; i++) {
                UserInfo user = room.getUsers().get(i);
                if (user != null && user.isDead()) {
                    alive--;
                }
            }

            // 생존자 수가 1명 이하일 경우 게임 종료
            if (alive <= 1) {
                message.setType(Message.MessageType.END);
                message.setUserInfo(system);
                room.setStart(false);

                // 게임 종료 시 게임 내 정보 초기화
                for (int i = 1; i <= 6; i++) {
                    UserInfo user = room.getUsers().get(i);
                    if (user != null) {
                        if (user.isBaesinzer()) {
                            message.setMessage(user.getUsername() + "이(가) 시민을 모두 처리하였습니다.");
                            user.setBaesinzer(false);
                        }
                        user.setBaesinzer(false);
                        user.setDead(false);
                        user.setLocationId(0);
                        user.setVotedNum(0);
                        user.setHasVoted(0);
                        user.setMissionList(null);
                        user.setKill(0);
                    }
                }

                operations.convertAndSend("/sub/socket/room/" + room.getRoomCode(), message);
            }
        }
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
