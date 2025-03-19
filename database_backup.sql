--
-- PostgreSQL database dump
--

-- Dumped from database version 16.8
-- Dumped by pg_dump version 16.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: bookings; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.bookings (
    id integer NOT NULL,
    table_id integer NOT NULL,
    date timestamp without time zone NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    phone text NOT NULL,
    guest_count integer NOT NULL
);


ALTER TABLE public.bookings OWNER TO neondb_owner;

--
-- Name: bookings_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.bookings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bookings_id_seq OWNER TO neondb_owner;

--
-- Name: bookings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.bookings_id_seq OWNED BY public.bookings.id;


--
-- Name: events; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.events (
    id integer NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    image_url text NOT NULL,
    date timestamp without time zone NOT NULL,
    featured boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.events OWNER TO neondb_owner;

--
-- Name: events_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.events_id_seq OWNER TO neondb_owner;

--
-- Name: events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.events_id_seq OWNED BY public.events.id;


--
-- Name: loyalty_points; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.loyalty_points (
    id integer NOT NULL,
    user_id integer NOT NULL,
    points integer NOT NULL,
    description text NOT NULL,
    order_id integer,
    type text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.loyalty_points OWNER TO neondb_owner;

--
-- Name: loyalty_points_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.loyalty_points_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.loyalty_points_id_seq OWNER TO neondb_owner;

--
-- Name: loyalty_points_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.loyalty_points_id_seq OWNED BY public.loyalty_points.id;


--
-- Name: loyalty_rewards; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.loyalty_rewards (
    id integer NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    points_cost integer NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.loyalty_rewards OWNER TO neondb_owner;

--
-- Name: loyalty_rewards_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.loyalty_rewards_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.loyalty_rewards_id_seq OWNER TO neondb_owner;

--
-- Name: loyalty_rewards_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.loyalty_rewards_id_seq OWNED BY public.loyalty_rewards.id;


--
-- Name: loyalty_tiers; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.loyalty_tiers (
    id integer NOT NULL,
    name text NOT NULL,
    minimum_points integer NOT NULL,
    points_multiplier numeric(3,2) NOT NULL,
    benefits text[] NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.loyalty_tiers OWNER TO neondb_owner;

--
-- Name: loyalty_tiers_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.loyalty_tiers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.loyalty_tiers_id_seq OWNER TO neondb_owner;

--
-- Name: loyalty_tiers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.loyalty_tiers_id_seq OWNED BY public.loyalty_tiers.id;


--
-- Name: menu_categories; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.menu_categories (
    id integer NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    image_url text NOT NULL
);


ALTER TABLE public.menu_categories OWNER TO neondb_owner;

--
-- Name: menu_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.menu_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.menu_categories_id_seq OWNER TO neondb_owner;

--
-- Name: menu_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.menu_categories_id_seq OWNED BY public.menu_categories.id;


--
-- Name: menu_items; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.menu_items (
    id integer NOT NULL,
    category_id integer NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    price numeric(10,2) NOT NULL,
    image_url text NOT NULL,
    is_special boolean DEFAULT false NOT NULL,
    nutrition_info text[],
    ingredients text[],
    chefs_story text,
    preparation_time text,
    spicy_level text,
    allergens text[],
    serving_size text
);


ALTER TABLE public.menu_items OWNER TO neondb_owner;

--
-- Name: menu_items_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.menu_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.menu_items_id_seq OWNER TO neondb_owner;

--
-- Name: menu_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.menu_items_id_seq OWNED BY public.menu_items.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    items text[] NOT NULL,
    total numeric(10,2) NOT NULL,
    status text NOT NULL,
    customer_name text NOT NULL,
    customer_email text NOT NULL,
    customer_phone text NOT NULL,
    created_at timestamp without time zone NOT NULL
);


ALTER TABLE public.orders OWNER TO neondb_owner;

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_id_seq OWNER TO neondb_owner;

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: servers; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.servers (
    id integer NOT NULL,
    name text NOT NULL,
    code text NOT NULL,
    is_active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.servers OWNER TO neondb_owner;

--
-- Name: servers_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.servers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.servers_id_seq OWNER TO neondb_owner;

--
-- Name: servers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.servers_id_seq OWNED BY public.servers.id;


--
-- Name: site_settings; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.site_settings (
    id integer NOT NULL,
    language text DEFAULT 'en'::text NOT NULL,
    country text DEFAULT 'US'::text NOT NULL,
    currency text DEFAULT 'USD'::text NOT NULL,
    translations jsonb DEFAULT '{}'::jsonb NOT NULL,
    privacy_policy text DEFAULT ''::text NOT NULL,
    cookie_policy text DEFAULT ''::text NOT NULL,
    terms_conditions text DEFAULT ''::text NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.site_settings OWNER TO neondb_owner;

--
-- Name: site_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.site_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.site_settings_id_seq OWNER TO neondb_owner;

--
-- Name: site_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.site_settings_id_seq OWNED BY public.site_settings.id;


--
-- Name: table_assignments; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.table_assignments (
    id integer NOT NULL,
    table_id integer NOT NULL,
    server_id integer NOT NULL,
    start_time timestamp without time zone NOT NULL,
    end_time timestamp without time zone,
    status text NOT NULL,
    notes text
);


ALTER TABLE public.table_assignments OWNER TO neondb_owner;

--
-- Name: table_assignments_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.table_assignments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.table_assignments_id_seq OWNER TO neondb_owner;

--
-- Name: table_assignments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.table_assignments_id_seq OWNED BY public.table_assignments.id;


--
-- Name: tables; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.tables (
    id integer NOT NULL,
    name text NOT NULL,
    section text NOT NULL,
    seats integer NOT NULL,
    shape text NOT NULL,
    status text DEFAULT 'available'::text NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    minimum_spend numeric(10,2),
    notes text
);


ALTER TABLE public.tables OWNER TO neondb_owner;

--
-- Name: tables_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.tables_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tables_id_seq OWNER TO neondb_owner;

--
-- Name: tables_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.tables_id_seq OWNED BY public.tables.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    total_points integer DEFAULT 0 NOT NULL,
    current_tier_id integer DEFAULT 1 NOT NULL,
    role text DEFAULT 'customer'::text NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    is_verified boolean DEFAULT false,
    verification_code text,
    verification_expiry timestamp without time zone
);


ALTER TABLE public.users OWNER TO neondb_owner;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO neondb_owner;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: bookings id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.bookings ALTER COLUMN id SET DEFAULT nextval('public.bookings_id_seq'::regclass);


--
-- Name: events id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.events ALTER COLUMN id SET DEFAULT nextval('public.events_id_seq'::regclass);


--
-- Name: loyalty_points id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.loyalty_points ALTER COLUMN id SET DEFAULT nextval('public.loyalty_points_id_seq'::regclass);


--
-- Name: loyalty_rewards id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.loyalty_rewards ALTER COLUMN id SET DEFAULT nextval('public.loyalty_rewards_id_seq'::regclass);


--
-- Name: loyalty_tiers id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.loyalty_tiers ALTER COLUMN id SET DEFAULT nextval('public.loyalty_tiers_id_seq'::regclass);


--
-- Name: menu_categories id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.menu_categories ALTER COLUMN id SET DEFAULT nextval('public.menu_categories_id_seq'::regclass);


--
-- Name: menu_items id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.menu_items ALTER COLUMN id SET DEFAULT nextval('public.menu_items_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: servers id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.servers ALTER COLUMN id SET DEFAULT nextval('public.servers_id_seq'::regclass);


--
-- Name: site_settings id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.site_settings ALTER COLUMN id SET DEFAULT nextval('public.site_settings_id_seq'::regclass);


--
-- Name: table_assignments id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.table_assignments ALTER COLUMN id SET DEFAULT nextval('public.table_assignments_id_seq'::regclass);


--
-- Name: tables id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.tables ALTER COLUMN id SET DEFAULT nextval('public.tables_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: bookings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.bookings (id, table_id, date, name, email, phone, guest_count) FROM stdin;
1	1	2025-03-18 00:00:00	John Smith	john@example.com	+1234567890	2
2	2	2025-03-19 00:00:00	Emma Wilson	emma@example.com	+1234567891	4
3	3	2025-03-18 00:00:00	Michael Brown	michael@example.com	+1234567892	6
4	4	2025-03-20 00:00:00	Sarah Davis	sarah@example.com	+1234567893	8
5	5	2025-03-19 00:00:00	James Wilson	james@example.com	+1234567894	4
6	8	2025-03-19 18:30:00	Peter Patel	tm10@tm.com	2134446629	6
\.


--
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.events (id, title, description, image_url, date, featured, created_at, updated_at) FROM stdin;
2	Wine Tasting Evening	Join us for an evening of fine wines and paired appetizers	https://images.unsplash.com/photo-1510812431401-41d2bd2722f3	2025-03-24 15:41:09.517066	t	2025-03-17 15:41:09.517066	2025-03-17 15:41:09.517066
3	Chef's Table Experience	An intimate dining experience with our head chef	https://images.unsplash.com/photo-1577219491135-ce391730fb2c	2025-03-31 15:41:09.517066	t	2025-03-17 15:41:09.517066	2025-03-17 15:41:09.517066
4	Live Jazz Night	Enjoy smooth jazz with your dinner every Friday	https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f	2025-04-07 15:41:09.517066	f	2025-03-17 15:41:09.517066	2025-03-17 15:41:09.517066
5	Seasonal Menu Launch	Be the first to taste our new seasonal dishes	https://images.unsplash.com/photo-1414235077428-338989a2e8c0	2025-04-16 15:41:09.517066	t	2025-03-17 15:41:09.517066	2025-03-17 15:41:09.517066
6	Cooking Class	Learn to make our signature dishes	https://images.unsplash.com/photo-1556910103-1c02745aae4d	2025-05-01 15:41:09.517066	f	2025-03-17 15:41:09.517066	2025-03-17 15:41:09.517066
\.


--
-- Data for Name: loyalty_points; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.loyalty_points (id, user_id, points, description, order_id, type, created_at) FROM stdin;
\.


--
-- Data for Name: loyalty_rewards; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.loyalty_rewards (id, name, description, points_cost, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: loyalty_tiers; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.loyalty_tiers (id, name, minimum_points, points_multiplier, benefits, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: menu_categories; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.menu_categories (id, name, description, image_url) FROM stdin;
1	Appetizers	Start your meal with these delicious starters	https://images.unsplash.com/photo-1541529086526-db283c563270
2	Main Courses	Hearty and satisfying main dishes	https://images.unsplash.com/photo-1544025162-d76694265947
3	Desserts	Sweet endings to your perfect meal	https://images.unsplash.com/photo-1551024506-0bccd828d307
\.


--
-- Data for Name: menu_items; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.menu_items (id, category_id, name, description, price, image_url, is_special, nutrition_info, ingredients, chefs_story, preparation_time, spicy_level, allergens, serving_size) FROM stdin;
2	2	Grilled Salmon	Fresh Atlantic salmon with lemon herb butter	24.99	https://images.unsplash.com/photo-1485921325833-c519f76c4927	t	{"Calories: 450","Protein: 46g","Omega-3: High"}	{"Atlantic salmon",Lemon,Herbs,Butter}	Sourced from sustainable fisheries	25 minutes	Not Spicy	{Fish}	1 person
3	2	Beef Tenderloin	Premium cut beef tenderloin with red wine reduction	34.99	https://images.unsplash.com/photo-1558030006-450675393462	f	{"Calories: 520","Protein: 52g","Iron: High"}	{"Beef tenderloin","Red wine",Butter,Herbs}	Our signature dish since 1995	30 minutes	Not Spicy	{None}	1 person
4	3	Chocolate Lava Cake	Warm chocolate cake with a molten center	9.99	https://images.unsplash.com/photo-1571877227200-a0d98ea607e9	t	{"Calories: 420","Sugar: 35g"}	{"Dark chocolate",Butter,Flour,Eggs}	A classic French dessert with our twist	20 minutes	Not Spicy	{Dairy,Eggs,Gluten}	1 person
5	1	Spring Rolls	Fresh vegetables wrapped in rice paper	8.99	https://images.unsplash.com/photo-1544025162-d76694265947	f	{"Calories: 220","Fiber: 4g"}	{"Rice paper",Carrots,Cucumber,Herbs}	Traditional recipe with a modern touch	15 minutes	Not Spicy	{Gluten}	2 people
1	1	Crispy Calamari	Tender calamari rings, lightly breaded and fried to perfection	12.99	https://images.unsplash.com/photo-1572862905000-c5b6244027a5	t	{"Calories: 380","Protein: 15g","Fat: 22g"}	{"Fresh calamari","Seasoned flour","Marinara sauce"}	Inspired by Mediterranean coastal cuisine	15 minutes	Mild	{Seafood,Gluten}	2-3 people
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.orders (id, items, total, status, customer_name, customer_email, customer_phone, created_at) FROM stdin;
\.


--
-- Data for Name: servers; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.servers (id, name, code, is_active) FROM stdin;
\.


--
-- Data for Name: site_settings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.site_settings (id, language, country, currency, translations, privacy_policy, cookie_policy, terms_conditions, updated_at) FROM stdin;
1	en	US	USD	{}				2025-03-17 19:11:34.972
\.


--
-- Data for Name: table_assignments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.table_assignments (id, table_id, server_id, start_time, end_time, status, notes) FROM stdin;
\.


--
-- Data for Name: tables; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.tables (id, name, section, seats, shape, status, is_active, minimum_spend, notes) FROM stdin;
6	Window Table 1	Window	2	round	available	t	50.00	Perfect for couples
10	Garden 1	Outdoor	4	round	available	t	100.00	Outdoor seating with garden view
7	Window Table 2	Window	4	rectangular	available	t	100.00	Family seating with view
9	Main Hall 2	Main	8	rectangular	available	t	200.00	Large group seating
8	Main Hall 1	Main	6	rectangular	available	t	150.00	Group dining space
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.users (id, name, email, password, total_points, current_tier_id, role, is_active, created_at, updated_at, is_verified, verification_code, verification_expiry) FROM stdin;
7	Rock	tl@tl.com	$2b$10$aIWLG9Cffn3iwb5uPw.PPOwF68MbEpfBD0c/d/eGtAxL37T0X27Di	0	1	customer	t	2025-03-17 21:02:46.033103	2025-03-17 21:02:46.033103	f	\N	\N
\.


--
-- Name: bookings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.bookings_id_seq', 6, true);


--
-- Name: events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.events_id_seq', 6, true);


--
-- Name: loyalty_points_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.loyalty_points_id_seq', 1, false);


--
-- Name: loyalty_rewards_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.loyalty_rewards_id_seq', 1, false);


--
-- Name: loyalty_tiers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.loyalty_tiers_id_seq', 1, false);


--
-- Name: menu_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.menu_categories_id_seq', 3, true);


--
-- Name: menu_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.menu_items_id_seq', 5, true);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.orders_id_seq', 5, true);


--
-- Name: servers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.servers_id_seq', 1, false);


--
-- Name: site_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.site_settings_id_seq', 1, false);


--
-- Name: table_assignments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.table_assignments_id_seq', 1, false);


--
-- Name: tables_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.tables_id_seq', 10, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.users_id_seq', 7, true);


--
-- Name: bookings bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (id);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- Name: loyalty_points loyalty_points_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.loyalty_points
    ADD CONSTRAINT loyalty_points_pkey PRIMARY KEY (id);


--
-- Name: loyalty_rewards loyalty_rewards_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.loyalty_rewards
    ADD CONSTRAINT loyalty_rewards_pkey PRIMARY KEY (id);


--
-- Name: loyalty_tiers loyalty_tiers_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.loyalty_tiers
    ADD CONSTRAINT loyalty_tiers_pkey PRIMARY KEY (id);


--
-- Name: menu_categories menu_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.menu_categories
    ADD CONSTRAINT menu_categories_pkey PRIMARY KEY (id);


--
-- Name: menu_items menu_items_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.menu_items
    ADD CONSTRAINT menu_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: servers servers_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.servers
    ADD CONSTRAINT servers_pkey PRIMARY KEY (id);


--
-- Name: site_settings site_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.site_settings
    ADD CONSTRAINT site_settings_pkey PRIMARY KEY (id);


--
-- Name: table_assignments table_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.table_assignments
    ADD CONSTRAINT table_assignments_pkey PRIMARY KEY (id);


--
-- Name: tables tables_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.tables
    ADD CONSTRAINT tables_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

