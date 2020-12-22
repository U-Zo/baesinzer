package projectw.baesinzer.domain;

import lombok.Builder;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class Location {

    @NonNull
    private int locationId;

    @NonNull
    private String locationName;

    @NonNull
    private boolean close;

    @NonNull
    private List<UserInfo> userList;

    @NonNull
    private List<DeadUser> deadList;
}
