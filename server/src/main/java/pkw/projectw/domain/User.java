package pkw.projectw.domain;

import lombok.*;

import javax.persistence.*;

@Table(name = "users")
@SequenceGenerator(
        name="USER_SEQ_GEN",
        sequenceName = "USER_SEQ"
)
@Entity
@Getter
@Setter
@NoArgsConstructor
@RequiredArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE,
            generator = "USER_SEQ_GEN"
    )
    private Long id;

    @NonNull
    private String email;

    @NonNull
    private String password;

    private char verified = '0';

    @Enumerated(EnumType.STRING)
    private UserRole role = UserRole.ROLE_NOT_PERMITTED;

    private String refresh_token;
}
