PGDMP  7    )                }            PaulGorForum    17.5    17.5 -    `           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            a           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            b           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            c           1262    16505    PaulGorForum    DATABASE     �   CREATE DATABASE "PaulGorForum" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_Hong Kong SAR.1252';
    DROP DATABASE "PaulGorForum";
                     postgres    false            [           1247    16508    comments_client    TYPE     $  CREATE TYPE public.comments_client AS (
	comment_id integer,
	publisher character varying,
	created_at timestamp without time zone,
	content character varying,
	parent_id integer,
	up_votes integer,
	down_votes integer,
	vote_diff integer,
	voted character varying,
	comment_order integer
);
 "   DROP TYPE public.comments_client;
       public               postgres    false            ^           1247    16511    vote_details    TYPE     i   CREATE TYPE public.vote_details AS (
	id integer,
	up_votes integer,
	down_votes integer,
	voted text
);
    DROP TYPE public.vote_details;
       public               postgres    false            �            1255    16512 "   get_all_comments(integer, integer)    FUNCTION     j  CREATE FUNCTION public.get_all_comments(p_post_id integer, p_user_id integer DEFAULT '-1'::integer) RETURNS SETOF public.comments_client
    LANGUAGE sql
    AS $$
	  WITH
  comments_base AS (
    SELECT
      c.comment_id,
      u.name publisher,
      c.created_at created_at,
      c.content,
      c.parent_id
    FROM
      comments c
      JOIN users u USING (user_id)
    WHERE
      c.post_id = p_post_id
  ),
  count_votes AS (
    SELECT
      cmt_b.comment_id,
      SUM(
        CASE
          WHEN cv.is_up THEN 1
          ELSE 0
        END
      ) up_votes,
      SUM(
        CASE
          WHEN NOT cv.is_up THEN 1
          ELSE 0
        END
      ) down_votes,
      (
        SUM(
          CASE
            WHEN cv.is_up THEN 1
            ELSE 0
          END
        ) - SUM(
          CASE
            WHEN NOT cv.is_up THEN 1
            ELSE 0
          END
        )
      ) vote_diff,
      (
        CASE
          WHEN NOT (BOOL_OR (cv.user_id = p_user_id) IS true) THEN NULL
          WHEN BOOL_OR (
            cv.user_id = p_user_id
            AND cv.is_up
          ) THEN 'up'
          ELSE 'down'
        END
      ) voted
    FROM
      comments_base cmt_b
      LEFT JOIN comment_votes cv USING (comment_id)
    GROUP BY
      cmt_b.comment_id
  )
  SELECT
    cmt_b.comment_id,
    cmt_b.publisher,
    cmt_b.created_at created_at,
    cmt_b.content,
    cmt_b.parent_id,
    cv.up_votes::INT,
    cv.down_votes::INT,
    cv.vote_diff::INT vote_diff,
    cv.voted,
    Rank() OVER(ORDER BY created_at)::INT comment_order
  FROM
    comments_base cmt_b
    JOIN count_votes cv USING (comment_id)
$$;
 M   DROP FUNCTION public.get_all_comments(p_post_id integer, p_user_id integer);
       public               postgres    false    859            �            1255    16513 )   get_comments(integer, integer[], integer)    FUNCTION       CREATE FUNCTION public.get_comments(p_post_id integer, p_comment_ids integer[], p_user_id integer DEFAULT '-1'::integer) RETURNS SETOF public.comments_client
    LANGUAGE sql
    AS $$
	SELECT *
	FROM get_all_comments(p_post_id,p_user_id) c
	WHERE c.comment_id = ANY(p_comment_ids)
$$;
 b   DROP FUNCTION public.get_comments(p_post_id integer, p_comment_ids integer[], p_user_id integer);
       public               postgres    false    859            �            1255    16514    get_vote_details(integer)    FUNCTION     ?  CREATE FUNCTION public.get_vote_details(p_user_id integer) RETURNS SETOF public.vote_details
    LANGUAGE sql
    AS $$
	SELECT
		m.comment_id id,
		SUM(CASE WHEN v.is_up THEN 1 ELSE 0 END)::INT up_votes,
		SUM(CASE WHEN NOT v.is_up THEN 1 ELSE 0 END)::INT down_votes,
		(
			CASE
			WHEN NOT (BOOL_OR (v.user_id = p_user_id) IS true) THEN NULL
			WHEN BOOL_OR (
				v.user_id = p_user_id
				AND v.is_up
			) THEN 'up'
			ELSE 'down'
			END
		)voted
	FROM
		comments m
		JOIN users u USING(user_id)
		LEFT JOIN comment_votes v USING(comment_id)
	GROUP BY
		m.comment_id
$$;
 :   DROP FUNCTION public.get_vote_details(p_user_id integer);
       public               postgres    false    862            �            1259    16515 
   categories    TABLE     m   CREATE TABLE public.categories (
    cat_id integer NOT NULL,
    cat_name character varying(50) NOT NULL
);
    DROP TABLE public.categories;
       public         heap r       postgres    false            �            1259    16518    comment_votes    TABLE     �   CREATE TABLE public.comment_votes (
    user_id integer NOT NULL,
    comment_id integer NOT NULL,
    is_up boolean DEFAULT false NOT NULL
);
 !   DROP TABLE public.comment_votes;
       public         heap r       postgres    false            �            1259    16522    comments    TABLE     U  CREATE TABLE public.comments (
    comment_id integer NOT NULL,
    content character varying(5000),
    user_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    post_id integer NOT NULL,
    parent_id integer,
    CONSTRAINT no_empty_content CHECK ((char_length((content)::text) > 0))
);
    DROP TABLE public.comments;
       public         heap r       postgres    false            �            1259    16529    comments_comment_id_seq    SEQUENCE     �   ALTER TABLE public.comments ALTER COLUMN comment_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.comments_comment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public               postgres    false    221            �            1259    16530    post_cat_cat_id_seq    SEQUENCE     �   ALTER TABLE public.categories ALTER COLUMN cat_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.post_cat_cat_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public               postgres    false    219            �            1259    16531    posts    TABLE     H  CREATE TABLE public.posts (
    post_id integer NOT NULL,
    title character varying(200) NOT NULL,
    cat_id integer NOT NULL,
    view_count integer DEFAULT 0,
    user_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT posts_view_count_check CHECK ((view_count >= 0))
);
    DROP TABLE public.posts;
       public         heap r       postgres    false            �            1259    16537    posts_post_id_seq    SEQUENCE     �   ALTER TABLE public.posts ALTER COLUMN post_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.posts_post_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public               postgres    false    224            �            1259    16538    users    TABLE     8  CREATE TABLE public.users (
    user_id integer NOT NULL,
    name character varying(50) NOT NULL,
    password character varying(60) NOT NULL,
    email character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_login timestamp without time zone
);
    DROP TABLE public.users;
       public         heap r       postgres    false            �            1259    16542    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public               postgres    false    226            d           0    0    users_id_seq    SEQUENCE OWNED BY     B   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.user_id;
          public               postgres    false    227            �           2604    16543    users user_id    DEFAULT     i   ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_id_seq'::regclass);
 <   ALTER TABLE public.users ALTER COLUMN user_id DROP DEFAULT;
       public               postgres    false    227    226            U          0    16515 
   categories 
   TABLE DATA           6   COPY public.categories (cat_id, cat_name) FROM stdin;
    public               postgres    false    219   �?       V          0    16518    comment_votes 
   TABLE DATA           C   COPY public.comment_votes (user_id, comment_id, is_up) FROM stdin;
    public               postgres    false    220   �?       W          0    16522    comments 
   TABLE DATA           `   COPY public.comments (comment_id, content, user_id, created_at, post_id, parent_id) FROM stdin;
    public               postgres    false    221   @       Z          0    16531    posts 
   TABLE DATA           X   COPY public.posts (post_id, title, cat_id, view_count, user_id, created_at) FROM stdin;
    public               postgres    false    224   !@       \          0    16538    users 
   TABLE DATA           W   COPY public.users (user_id, name, password, email, created_at, last_login) FROM stdin;
    public               postgres    false    226   >@       e           0    0    comments_comment_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.comments_comment_id_seq', 1, false);
          public               postgres    false    222            f           0    0    post_cat_cat_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.post_cat_cat_id_seq', 2, true);
          public               postgres    false    223            g           0    0    posts_post_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.posts_post_id_seq', 1, false);
          public               postgres    false    225            h           0    0    users_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.users_id_seq', 1, false);
          public               postgres    false    227            �           2606    16545 "   categories categories_cat_name_key 
   CONSTRAINT     a   ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_cat_name_key UNIQUE (cat_name);
 L   ALTER TABLE ONLY public.categories DROP CONSTRAINT categories_cat_name_key;
       public                 postgres    false    219            �           2606    16547    comments comments_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (comment_id);
 @   ALTER TABLE ONLY public.comments DROP CONSTRAINT comments_pkey;
       public                 postgres    false    221            �           2606    16549    comment_votes pk_comment_votes 
   CONSTRAINT     m   ALTER TABLE ONLY public.comment_votes
    ADD CONSTRAINT pk_comment_votes PRIMARY KEY (user_id, comment_id);
 H   ALTER TABLE ONLY public.comment_votes DROP CONSTRAINT pk_comment_votes;
       public                 postgres    false    220    220            �           2606    16551    categories post_cat_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.categories
    ADD CONSTRAINT post_cat_pkey PRIMARY KEY (cat_id);
 B   ALTER TABLE ONLY public.categories DROP CONSTRAINT post_cat_pkey;
       public                 postgres    false    219            �           2606    16553    posts posts_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (post_id);
 :   ALTER TABLE ONLY public.posts DROP CONSTRAINT posts_pkey;
       public                 postgres    false    224            �           2606    16555    users users_email_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
 ?   ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_key;
       public                 postgres    false    226            �           2606    16557    users users_name_key 
   CONSTRAINT     O   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_name_key UNIQUE (name);
 >   ALTER TABLE ONLY public.users DROP CONSTRAINT users_name_key;
       public                 postgres    false    226            �           2606    16559    users users_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public                 postgres    false    226            �           1259    16560    fki_F    INDEX     A   CREATE INDEX "fki_F" ON public.comments USING btree (parent_id);
    DROP INDEX public."fki_F";
       public                 postgres    false    221            �           2606    16561    posts fk_cat    FK CONSTRAINT     �   ALTER TABLE ONLY public.posts
    ADD CONSTRAINT fk_cat FOREIGN KEY (cat_id) REFERENCES public.categories(cat_id) ON DELETE CASCADE;
 6   ALTER TABLE ONLY public.posts DROP CONSTRAINT fk_cat;
       public               postgres    false    224    4783    219            �           2606    16566    comment_votes fk_comment    FK CONSTRAINT     �   ALTER TABLE ONLY public.comment_votes
    ADD CONSTRAINT fk_comment FOREIGN KEY (comment_id) REFERENCES public.comments(comment_id) ON DELETE CASCADE;
 B   ALTER TABLE ONLY public.comment_votes DROP CONSTRAINT fk_comment;
       public               postgres    false    4787    220    221            �           2606    16571    comments fk_parent    FK CONSTRAINT     �   ALTER TABLE ONLY public.comments
    ADD CONSTRAINT fk_parent FOREIGN KEY (parent_id) REFERENCES public.comments(comment_id) ON DELETE CASCADE;
 <   ALTER TABLE ONLY public.comments DROP CONSTRAINT fk_parent;
       public               postgres    false    4787    221    221            �           2606    16576    comments fk_post    FK CONSTRAINT     �   ALTER TABLE ONLY public.comments
    ADD CONSTRAINT fk_post FOREIGN KEY (post_id) REFERENCES public.posts(post_id) ON DELETE CASCADE;
 :   ALTER TABLE ONLY public.comments DROP CONSTRAINT fk_post;
       public               postgres    false    221    4790    224            �           2606    16581    comments fk_publisher    FK CONSTRAINT     �   ALTER TABLE ONLY public.comments
    ADD CONSTRAINT fk_publisher FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;
 ?   ALTER TABLE ONLY public.comments DROP CONSTRAINT fk_publisher;
       public               postgres    false    4796    221    226            �           2606    16586    comment_votes fk_user    FK CONSTRAINT     �   ALTER TABLE ONLY public.comment_votes
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;
 ?   ALTER TABLE ONLY public.comment_votes DROP CONSTRAINT fk_user;
       public               postgres    false    226    220    4796            �           2606    16591    posts fk_user_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.posts
    ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;
 :   ALTER TABLE ONLY public.posts DROP CONSTRAINT fk_user_id;
       public               postgres    false    4796    226    224            U      x�3��K-/�2�t��K�KN����� D`�      V      x������ � �      W      x������ � �      Z      x������ � �      \      x������ � �     