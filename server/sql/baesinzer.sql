-- 사용자 및 스키마 생성
drop user projectw;
create user projectw identified by root;

-- 사용자 권한 부여
grant connect, resource to projectw;

-- projectw 스키마 테이블 초기화
drop table users cascade constraints;
drop table verification_token cascade constraints;
drop sequence user_seq;
drop sequence verification_seq;

-- projectw 스키마 시퀀스 생성
create sequence user_seq
    start with 1
    increment by 50;

create sequence verification_seq
    start with 1
    increment by 50;

-- projectw 테이블 생성
create table users
(
    id            number(19, 0)
        constraint users_id_pk primary key,
    email         varchar2(40) not null,
    password      varchar2(255) not null,
    refresh_token varchar2(255),
    role          varchar2(20)
);

create table verification_token
(
    id               number(19, 0)
        constraint verification_token_id_pk primary key,
    expire_date_time timestamp,
    status           varchar2(8),
    token            varchar2(255),
    user_id          number(19, 0)
        constraint verification_token_user_id_fk
        references users(id)
);
