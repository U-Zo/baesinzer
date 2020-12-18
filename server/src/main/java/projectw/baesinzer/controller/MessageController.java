package projectw.baesinzer.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import projectw.baesinzer.domain.*;
import projectw.baesinzer.service.RoomService;

import java.util.List;
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
        message.setRoom(room);

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
                if (room.getUsers().get(userInfo.getUserNo()) != null) {
                    room.getUsers().put(userInfo.getUserNo(), userInfo);
                    headerAccessor.getSessionAttributes().put("user", userInfo);
                }
                break;
            case KILL:
                int killNo = userInfo.getKill();
                UserInfo deadUser = room.getUsers().get(killNo);
                deadUser.setDead(true);

                // 살해된 유저 추가
                room.getDeadList().add(new DeadUser(deadUser.getUsername(), deadUser.getLocationId()));
                if (room.getUsers().get(userInfo.getUserNo()) != null) {
                    room.getUsers().put(userInfo.getUserNo(), userInfo);
                    headerAccessor.getSessionAttributes().put("user", userInfo);
                }
                break;
            case VOTE_START:
                room.getDeadList().clear(); // dead 상태 유저 목록 초기화
                message.setUserInfo(system);
                message.setMessage("긴급 회의가 시작되었습니다.");
                for (int i = 1; i <= 6; i++) {
                    if (room.getUsers().get(i) != null) {
                        room.getUsers().get(i).setHasVoted(0);
                        room.getUsers().get(i).setVotedNum(0);
                        room.getUsers().get(i).setLocationId(0);
                    }
                }
                break;
            case VOTE:
                int userNo = userInfo.getHasVoted();
                if (userNo == 0) {
                    userInfo.setHasVoted(-1);
                }
                UserInfo votedUserInfo = room.getUsers().get(userNo);
                if (userNo == userInfo.getUserNo()) {
                    if (votedUserInfo != null) votedUserInfo.setHasVoted(userNo);
                } else {
                    if (room.getUsers().get(userInfo.getUserNo()) != null) {
                        room.getUsers().put(userInfo.getUserNo(), userInfo);
                        headerAccessor.getSessionAttributes().put("user", userInfo);
                    }
                }
                if (votedUserInfo != null) votedUserInfo.setVotedNum(votedUserInfo.getVotedNum() + 1);
                message.setMessage(userInfo.getUsername() + "이(가) 투표했다.");
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

                selectNewHost(_userInfo, system, room);

                headerAccessor.getSessionAttributes().remove("user");
                headerAccessor.getSessionAttributes().remove("room");

                message.setMessage(userInfo.getUsername() + "님이 퇴장하셨습니다.");
                break;
        }

        operations.convertAndSend("/sub/socket/room/" + room.getRoomCode(), message);

        System.out.println("메시지 보내고 나서");
        message.setUserInfo(system);

        if (room.isStart()) {
            int missions = (room.getCount() - 1) * 4; // 시민의 총 미션 수
            int alive = room.getCount() - 1;

            // 현재 수행된 미션 수 확인
            for (int i = 1; i <= 6; i++) {
                UserInfo user = room.getUsers().get(i);
                if (user != null) {
                    List<Mission> missionList = user.getMissionList();
                    for (Mission mission : missionList) {
                        if (mission.isDone()) {
                            missions--;
                        }
                    }
                }
            }

            // 미션이 남지 않았다면 게임 종료
            if (missions < 1) {
                gameEnd(message, room);
                message.setMessage("실험 종료, 모든 일과를 수행하였습니다. (시민 승리)");
                operations.convertAndSend("/sub/socket/room/" + room.getRoomCode(), message);
                return;
            }

            // 생존자 수 확인
            for (int i = 1; i <= 6; i++) {
                UserInfo user = room.getUsers().get(i);
                if (user != null && user.isDead()) {
                    alive--;
                }
            }

            if (message.getType().equals(Message.MessageType.VOTE)) {
                int hasVoted = alive + 1;

                // 투표 수 확인
                UserInfo maxVoted = null;
                boolean isEqual = false;
                for (int i = 1; i <= 6; i++) {
                    UserInfo user = room.getUsers().get(i);

                    if (user == null) {
                        continue;
                    }

                    if (user.getHasVoted() != 0) {
                        hasVoted--;
                    }

                    // 투표를 제일 많이 받은 유저 초기화
                    if (maxVoted == null) {
                        maxVoted = user;
                        continue;
                    }

                    // 제일 많은 득표자 선정
                    if (maxVoted.getVotedNum() == user.getVotedNum()) {
                        System.out.println(maxVoted.getUserNo() + ": " + maxVoted.getVotedNum());
                        System.out.println(user.getUserNo() + ": " + user.getVotedNum());
                        isEqual = true;
                    } else if (maxVoted.getVotedNum() < user.getVotedNum()) {
                        isEqual = false;
                        maxVoted = user;
                    }
                    System.out.println(isEqual);
                    System.out.println("남은 투표: " + hasVoted);
                }

                if (hasVoted == 0) {
                    message.setType(Message.MessageType.VOTE_END);
                    message.setUserInfo(system);
                    message.setMessage("투표가 끝났습니다.");
                    operations.convertAndSend("/sub/socket/room/" + room.getRoomCode(), message);

                    if (isEqual) {
                        message.setType(Message.MessageType.ROOM);
                        message.setMessage("투표 수 동점으로 무효 처리 되었습니다.");
                        operations.convertAndSend("/sub/socket/room/" + room.getRoomCode(), message);
                    } else {
                        maxVoted.setDead(true);
                        message.setType(Message.MessageType.ROOM);
                        if (maxVoted.isBaesinzer()) {
                            message.setMessage(maxVoted.getUsername() + "은(는) BaesinZer입니다.");
                            operations.convertAndSend("/sub/socket/room/" + room.getRoomCode(), message);
                            gameEnd(message, room);
                            message.setMessage("실험 종료, BaesinZer를 잡았습니다.");
                            operations.convertAndSend("/sub/socket/room/" + room.getRoomCode(), message);
                            return;
                        } else {
                            message.setMessage(maxVoted.getUsername() + "은(는) 선량한 시민입니다.");
                            maxVoted.setDead(true);
                            operations.convertAndSend("/sub/socket/room/" + room.getRoomCode(), message);
                        }
                    }
                }
            }

            // 생존자 수 확인
            alive = room.getCount() - 1;
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
                    System.out.println(room.getUsers());
                    UserInfo user = room.getUsers().get(i);
                    if (user != null) {
                        if (user.isBaesinzer()) {
                            message.setMessage("실험 종료, " + user.getUsername() + "이(가) 시민을 모두 처리하였습니다.");
                            user.setBaesinzer(false);
                        }
                        user.setBaesinzer(false);
                        user.setDead(false);
                        user.setLocationId(0);
                        user.setVotedNum(0);
                        user.setHasVoted(0);
                        user.setKill(0);
                    }
                }

                operations.convertAndSend("/sub/socket/room/" + room.getRoomCode(), message);
            }
        }
    }

    private void gameEnd(Message message, Room room) {
        message.setType(Message.MessageType.END);
        room.setStart(false);

        // 게임 종료 시 게임 내 정보 초기화
        for (int i = 1; i <= 6; i++) {
            UserInfo user = room.getUsers().get(i);
            if (user != null) {
                user.setBaesinzer(false);
                user.setDead(false);
                user.setLocationId(0);
                user.setVotedNum(0);
                user.setHasVoted(0);
                user.setKill(0);
            }
        }
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());

        UserInfo userInfo = (UserInfo) headerAccessor.getSessionAttributes().get("user");
        String roomCode = (String) headerAccessor.getSessionAttributes().get("roomCode");
        UserInfo system = new UserInfo();
        system.setUsername("System");

        if (roomCode == null || userInfo == null) return;

        Room room = roomService.findOne(roomCode);
        room.getUsers().remove(userInfo.getUserNo());
        room.setCount(room.getUsers().size());

        // 방의 인원이 0이 되면 방 목록에서 삭제
        if (room.getUsers().size() == 0) {
            roomService.removeRoom(room);
        }

        selectNewHost(userInfo, system, room);

        Message message = new Message();
        message.setUserInfo(userInfo);
        message.setType(Message.MessageType.EXIT);
        message.setMessage(userInfo.getUsername() + "님이 퇴장하셨습니다.");
        message.setRoom(room);
        headerAccessor.getSessionAttributes().remove("user");
        headerAccessor.getSessionAttributes().remove("room");
        operations.convertAndSend("/sub/socket/room/" + roomCode, message);
    }

    private void selectNewHost(UserInfo userInfo, UserInfo system, Room room) {
        if (userInfo.isHost()) {
            for (int i = 1; i <= 6; i++) {
                UserInfo nextHost = room.getUsers().get(i);
                System.out.println("방장 선정");
                if (nextHost != null) {
                    nextHost.setHost(true);
                    Message nextHostMessage = new Message();
                    nextHostMessage.setType(Message.MessageType.ROOM);
                    nextHostMessage.setRoom(room);
                    nextHostMessage.setUserInfo(system);
                    nextHostMessage.setMessage(nextHost.getUsername() + " 님이 방장이 되셨습니다.");
                    operations.convertAndSend("/sub/socket/room/" + room.getRoomCode(), nextHostMessage);
                    break;
                }
            }
        }
    }
}
