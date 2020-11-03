package projectw.baesinzer.domain;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
public class Message {

    private String username;
    private String message;
    private String roomId;
}
