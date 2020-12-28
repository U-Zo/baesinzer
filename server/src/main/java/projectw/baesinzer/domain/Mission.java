package projectw.baesinzer.domain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Mission {

    private int missionId;
    private String missionName;
    private boolean isDone;
    private int locationId;
}
