package projectw.baesinzer.domain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Message {

    // 메시지 타입: 입장, 대기방, 인 게임, 퇴장
    public enum MessageType {
        JOIN, ROOM, PLAY, EXIT
    }

    private MessageType type;   // 메시지 타입
    private String roomCode;
    private UserInfo userInfo;
    private String message;
}
