/* ═══════════════════════════════════════════════════════════════════
   PAST LECTURES + MODULES — 24 November 2026 (run once)
   ═══════════════════════════════════════════════════════════════════
   Menu: 🚀 Automations → 📚 Add past lectures + seminars.

   1. Restores the Module of every lecture whose Module came out empty when
      the tab was rebuilt, from "Lectures (old 2026-11-24)" (same date and
      title).
   2. Adds the lectures held from February 2024 to December 2025, taken
      from the programmes published on the old website (West_Program_24,
      status 29.12.2024; West_Program_25, status 04.10.2025), plus two
      2026 students' meetings from West_Program_26. Module and Topic are
      set; Start/Finish hour and Description are left empty (the
      programmes don't give them). Descriptions are written from the titles
      and the course notes; an empty Description of a lecture already in the
      tab is filled too, a written one is never replaced.
   3. Adds the new topics to the Lists tab, sorts the tab by date.

   Safe to re-run: a lecture already there (same date and title) is not
   added twice, and a Module already filled is left alone.
   ═══════════════════════════════════════════════════════════════════ */

// [date dd/mm/yyyy, title, teacher 1, teacher 2, module, topic, description]
var PAST_LECTURES_ = [
 [
  "06/02/2024",
  "Welcome. Hero's Journey",
  "Kati Wortelkamp",
  "Lyudmila Skartsesku",
  1,
  "The Hero's Journey",
  "Opening evening of the training cohort. Kati Wortelkamp and Lyudmila Skartsesku introduce the programme and the Hero's Journey, Joseph Campbell's map of departure, ordeal and return, used throughout the training as a frame for each participant's own path of transformation."
 ],
 [
  "13/02/2024",
  "Overview over different psychotherapeutic approaches",
  "Prof. Jure Biechonski",
  "",
  1,
  "Psychotherapeutic Approaches",
  "An overview of the main families of psychotherapy, from psychodynamic and cognitive-behavioural to humanistic, systemic and transpersonal approaches: what each assumes about the human being, how it understands suffering and change, and where they meet."
 ],
 [
  "20/02/2024",
  "Cognitive Behavioral approach",
  "Prof. Jure Biechonski",
  "",
  1,
  "Psychotherapeutic Approaches",
  "An introduction to the cognitive-behavioural approach: how thoughts, emotions and behaviour influence each other, how dysfunctional beliefs are identified and restructured, and what this structured, goal-oriented method offers and leaves out."
 ],
 [
  "27/02/2024",
  "Humanistic approach",
  "Prof. Jure Biechonski",
  "",
  1,
  "Psychotherapeutic Approaches",
  "The humanistic approach of Rogers and Maslow: the inner tendency towards self-realisation, the therapeutic relationship built on empathy, congruence and unconditional positive regard, and the holistic view of the person that prepared the ground for transpersonal psychology."
 ],
 [
  "05/03/2024",
  "Fundamentals of analytical psychology and the Individualization Process according to Carl Gustav Jung: Shadow, projections, old patterns. Part I",
  "Prof. Jure Biechonski",
  "",
  1,
  "Analytical Psychology (C. G. Jung)",
  "Fundamentals of C. G. Jung's analytical psychology: the personal and collective unconscious, the shadow and the projections through which we meet it in others, old patterns that repeat themselves, and the individuation process as the lifelong movement towards wholeness."
 ],
 [
  "12/03/2024",
  "Introduction to counseling and counseling skills, Part I",
  "Prof. Jure Biechonski",
  "",
  1,
  "Transpersonal Counseling Skills and the Counseling Process",
  "First part of an introduction to counseling: what distinguishes counseling from psychotherapy, the stance of the counselor, and the basic skills of active listening, open questions and reflecting back what the client says and feels."
 ],
 [
  "19/03/2024",
  "Introduction to counseling and counseling skills, Part II",
  "Prof. Jure Biechonski",
  "",
  1,
  "Transpersonal Counseling Skills and the Counseling Process",
  "Second part of the introduction to counseling: structuring a session, building trust and a working alliance, and practising the core listening and questioning skills in pairs."
 ],
 [
  "26/03/2024",
  "Introduction to counseling and counseling skills, Part III",
  "Prof. Jure Biechonski",
  "",
  1,
  "Transpersonal Counseling Skills and the Counseling Process",
  "Third part of the introduction to counseling: moving from exploring the client's situation to focusing on what matters most, and supporting the client in finding their own next steps."
 ],
 [
  "09/04/2024",
  "Student's Meeting",
  "",
  "",
  1,
  "-",
  "An evening for the student group without a lecture: organisation of the coming module, peer exchange and space for questions about the training."
 ],
 [
  "16/04/2024",
  "What is transpersonal counseling?",
  "Prof. Jure Biechonski",
  "",
  1,
  "Transpersonal Counseling Skills and the Counseling Process",
  "What makes counseling transpersonal: a counselor who listens without judgment and without plans for the client, holds the experience offered, and makes room for meaning, values and spiritual experience alongside personal history."
 ],
 [
  "23/04/2024",
  "Exploring the bigger picture. Considering systemic, collective and transgenerational influences. An individual work with Family Constellation",
  "Samvedam B. Randles",
  "",
  1,
  "Family Constellations in the Group",
  "Samvedam B. Randles on looking beyond the individual: the systemic, collective and transgenerational influences that shape a person's life, explored through an individual piece of family constellation work."
 ],
 [
  "02/05/2024",
  "Resource based Systemic Therapy I",
  "Lev Belogorodskii",
  "",
  2,
  "Resource-based Systemic Therapy",
  "Lev Belogorodskii's Resource-Oriented Systemic Therapy (ROST) treats a resource not as energy to spend but as an opportunity to grow. This first session links our state of consciousness with the problems we try to solve, and shows how shifting attention to the resources held in the body changes the way a problem can be met."
 ],
 [
  "07/05/2024",
  "Resource based Systemic Therapy II",
  "Lev Belogorodskii",
  "",
  2,
  "Resource-based Systemic Therapy",
  "Lev Belogorodskii's Resource-Oriented Systemic Therapy (ROST) treats a resource not as energy to spend but as an opportunity to grow. This session looks at \"unfinished gestalts\" from early life, the patterns and bodily tension they leave behind, and the moments in a session that open a window for change."
 ],
 [
  "16/05/2024",
  "Resource based Systemic Therapy III",
  "Lev Belogorodskii",
  "",
  2,
  "Resource-based Systemic Therapy",
  "Lev Belogorodskii's Resource-Oriented Systemic Therapy (ROST) treats a resource not as energy to spend but as an opportunity to grow. This session looks at the two factors that make psychotherapy effective whatever the method: the quality of trust between client and therapist, and the therapist's own stable position and vision."
 ],
 [
  "21/05/2024",
  "Resource based Systemic Therapy IV",
  "Lev Belogorodskii",
  "",
  2,
  "Resource-based Systemic Therapy",
  "Lev Belogorodskii's Resource-Oriented Systemic Therapy (ROST) treats a resource not as energy to spend but as an opportunity to grow. The closing session works with the inner parts of a person: recognising them, letting them meet, and building mutual acceptance and cooperation, so that insight is lived in the body and not only understood."
 ],
 [
  "28/05/2024",
  "Process Oriented Therapy I",
  "Liudmila Serbina",
  "",
  2,
  "Process Oriented Therapy",
  "Process Work, developed by Arnold Mindell, sees symptoms, conflicts and difficult relationships as processes unfolding in time rather than fixed states, each carrying the seed of its own solution. First session: the main ideas of the approach, the \"dreaming\" that precedes consciousness, and the levels of consensus reality, dreamland and essence."
 ],
 [
  "04/06/2024",
  "Process Oriented Therapy II",
  "Liudmila Serbina",
  "",
  2,
  "Process Oriented Therapy",
  "Process Work, developed by Arnold Mindell, sees symptoms, conflicts and difficult relationships as processes unfolding in time rather than fixed states, each carrying the seed of its own solution. Second session: the channels through which experience arrives (visual, auditory, movement, body feeling, relationship and world) and how a therapist follows them."
 ],
 [
  "18/06/2024",
  "Process Oriented Therapy III",
  "Liudmila Serbina",
  "",
  2,
  "Process Oriented Therapy",
  "Process Work, developed by Arnold Mindell, sees symptoms, conflicts and difficult relationships as processes unfolding in time rather than fixed states, each carrying the seed of its own solution. Third session: primary and secondary process, the \"edge\" between them, and the beliefs that keep a person on the familiar side of it."
 ],
 [
  "25/06/2024",
  "Process Oriented Therapy IV",
  "Liudmila Serbina",
  "",
  2,
  "Process Oriented Therapy",
  "Process Work, developed by Arnold Mindell, sees symptoms, conflicts and difficult relationships as processes unfolding in time rather than fixed states, each carrying the seed of its own solution. Fourth session: working with body symptoms as messages of the dream, by finding the \"symptom creator\" behind the symptom and its creative potential."
 ],
 [
  "02/07/2024",
  "Process Oriented Therapy V",
  "Liudmila Serbina",
  "",
  2,
  "Process Oriented Therapy",
  "Process Work, developed by Arnold Mindell, sees symptoms, conflicts and difficult relationships as processes unfolding in time rather than fixed states, each carrying the seed of its own solution. Fifth session: relationships, family myths and world issues as fields that show up in individual symptoms, and how the wider environment is part of the process."
 ],
 [
  "09/07/2024",
  "Gestalt work technique in a transpersonal view I",
  "Lilian Gscheidel",
  "",
  2,
  "Gestalt Therapy: Chair Work",
  "Lilian Gscheidel on Gestalt therapy seen from a transpersonal perspective: the here and now, contact and awareness, and the unfinished situations that keep repeating until they are completed."
 ],
 [
  "16/07/2024",
  "Gestalt work technique in a transpersonal view II",
  "Lilian Gscheidel",
  "",
  2,
  "Gestalt Therapy: Chair Work",
  "Second part on Gestalt technique in a transpersonal view: practical work with polarities, dialogue between parts and attention to the body, and how completing a gestalt frees energy for growth."
 ],
 [
  "23/07/2024",
  "Tools of effective Psychotherapy",
  "Lyudmila Skartsesku",
  "",
  3,
  "Psychotherapeutic Approaches",
  "Lyudmila Skartsesku on what makes psychotherapy effective: the common factors shared by all good therapy, from the therapeutic alliance to the client's own resources, and the tools that put them to work in a session."
 ],
 [
  "13/08/2024",
  "«Creative Evolution 2.0». Ways to unlock higher Possibilities from Homo sapiens to Homo Evolutus",
  "Vladimir Maykov",
  "",
  3,
  "Creative Evolution 2.0",
  "Part of Vladimir Maykov's series \"Creative Evolution 2.0\", on human development as a growth in inner complexity supported by the \"tools of evolution\" we create: myths, maps, practices and cultures. This opening lecture asks what unlocks higher human possibilities, from Homo sapiens to \"Homo evolutus\"."
 ],
 [
  "20/08/2024",
  "This mysterious Self: What is Self-Improvement? Three Catalysts and three main \"Tools of Evolution\", six Directions of Development",
  "Vladimir Maykov",
  "",
  3,
  "Creative Evolution 2.0",
  "Part of Vladimir Maykov's series \"Creative Evolution 2.0\", on human development as a growth in inner complexity supported by the \"tools of evolution\" we create: myths, maps, practices and cultures. On the Self and self-improvement: three catalysts, three main tools of evolution, and six directions in which a person can develop."
 ],
 [
  "29/08/2024",
  "WE: Relationships as an evolutionary Practice. Interpersonal Development, its Laws and Essence",
  "Vladimir Maykov",
  "",
  3,
  "Creative Evolution 2.0",
  "Part of Vladimir Maykov's series \"Creative Evolution 2.0\", on human development as a growth in inner complexity supported by the \"tools of evolution\" we create: myths, maps, practices and cultures. On relationships as an evolutionary practice: the laws of interpersonal development and what \"we\" adds to \"I\"."
 ],
 [
  "12/09/2024",
  "Laws and Tools for the Development of the external World — the Development of Objectivity, Consensus, a systematic multidimensional View",
  "Vladimir Maykov",
  "",
  3,
  "Creative Evolution 2.0",
  "Part of Vladimir Maykov's series \"Creative Evolution 2.0\", on human development as a growth in inner complexity supported by the \"tools of evolution\" we create: myths, maps, practices and cultures. On developing the outer world: objectivity, consensus and a systematic, multidimensional view of reality."
 ],
 [
  "19/09/2024",
  "Champions: vertical upward Development. The West, multiple Intelligence, Spiral and Noetic Dynamics, a variety of Lines of Development towards the Highest",
  "Vladimir Maykov",
  "",
  3,
  "Creative Evolution 2.0",
  "Part of Vladimir Maykov's series \"Creative Evolution 2.0\", on human development as a growth in inner complexity supported by the \"tools of evolution\" we create: myths, maps, practices and cultures. On \"champions\" of vertical development: multiple intelligences, spiral dynamics and the many lines of growth towards the highest human potential."
 ],
 [
  "26/09/2024",
  "Healers: a Psychotherapist to himself. 12 ancient Practices of caring for the Soul. Cleansing and removing Obstacles to Development",
  "Vladimir Maykov",
  "",
  3,
  "Creative Evolution 2.0",
  "Part of Vladimir Maykov's series \"Creative Evolution 2.0\", on human development as a growth in inner complexity supported by the \"tools of evolution\" we create: myths, maps, practices and cultures. On \"healers\": the psychotherapist as their own first client, and twelve ancient practices of caring for the soul."
 ],
 [
  "03/10/2024",
  "Artists and Creators: Perfection in Discovering and expressing Yourself. Art as an evolutionary Practice",
  "Vladimir Maykov",
  "",
  3,
  "Creative Evolution 2.0",
  "Part of Vladimir Maykov's series \"Creative Evolution 2.0\", on human development as a growth in inner complexity supported by the \"tools of evolution\" we create: myths, maps, practices and cultures. On \"artists and creators\": discovering and expressing oneself, and art as an evolutionary practice."
 ],
 [
  "10/10/2024",
  "Tightrope Walkers: Masters of Balance, Mediocrity, Equanimity, the Art of surfing Life",
  "Vladimir Maykov",
  "",
  3,
  "Creative Evolution 2.0",
  "Part of Vladimir Maykov's series \"Creative Evolution 2.0\", on human development as a growth in inner complexity supported by the \"tools of evolution\" we create: myths, maps, practices and cultures. On \"tightrope walkers\": balance, equanimity and the art of riding the waves of life."
 ],
 [
  "17/10/2024",
  "Heroes: Heroism as the main Energy of Evolutionists. Three Classes and eight Types of Heroic Journeys and their Variations",
  "Vladimir Maykov",
  "",
  3,
  "Creative Evolution 2.0",
  "Part of Vladimir Maykov's series \"Creative Evolution 2.0\", on human development as a growth in inner complexity supported by the \"tools of evolution\" we create: myths, maps, practices and cultures. On \"heroes\": heroism as the main energy of evolution, and the classes and types of heroic journeys."
 ],
 [
  "24/10/2024",
  "The Awakened: What is Enlightenment: Classics and Modernity",
  "Vladimir Maykov",
  "",
  3,
  "Creative Evolution 2.0",
  "Part of Vladimir Maykov's series \"Creative Evolution 2.0\", on human development as a growth in inner complexity supported by the \"tools of evolution\" we create: myths, maps, practices and cultures. The closing lecture: what enlightenment means, in the classical traditions and today."
 ],
 [
  "29/10/2024",
  "Archetypes",
  "Kati Wortelkamp",
  "",
  4,
  "Archetypes",
  "Kati Wortelkamp on archetypes: the universal patterns of the collective unconscious described by Jung, how they appear in dreams, myths and non-ordinary states, and how meeting them can support a person's process."
 ],
 [
  "07/11/2024",
  "Biotransenergetics 1",
  "Pier Luigi Lattuada",
  "",
  4,
  "Biotransenergetics",
  "Biotransenergetics (BTE), the integral transpersonal approach of Pier Luigi Lattuada, describes human experience as a circuit of thinking, feeling and acting held within the Organismic Self. The opening session: intent and goal, the \"further mode\" of knowing, and the maps that help us navigate transpersonal experience."
 ],
 [
  "11/11/2024",
  "Biotransenergetics 2",
  "Pier Luigi Lattuada",
  "",
  4,
  "Biotransenergetics",
  "Biotransenergetics (BTE), the integral transpersonal approach of Pier Luigi Lattuada, describes human experience as a circuit of thinking, feeling and acting held within the Organismic Self. This session explores the threefold model of the Knower, the Feeler and the Doer, and why presence fails when one of these circuits is left open."
 ],
 [
  "18/11/2024",
  "Biotransenergetics 3",
  "Pier Luigi Lattuada",
  "",
  4,
  "Biotransenergetics",
  "Biotransenergetics (BTE), the integral transpersonal approach of Pier Luigi Lattuada, describes human experience as a circuit of thinking, feeling and acting held within the Organismic Self. This session introduces the fivefold model of the Organismic Self and the practice of moving attention through its levels."
 ],
 [
  "25/11/2024",
  "Biotransenergetics 4",
  "Pier Luigi Lattuada",
  "",
  4,
  "Biotransenergetics",
  "Biotransenergetics (BTE), the integral transpersonal approach of Pier Luigi Lattuada, describes human experience as a circuit of thinking, feeling and acting held within the Organismic Self. This session looks at limits as doors: staying with one's boundaries with acceptance instead of forcing them, and how this opens the way for change."
 ],
 [
  "27/11/2024",
  "Film: \"The secret of Carlos Castaneda\"",
  "Vladimir Maykov",
  "",
  4,
  "Creative Evolution 2.0",
  "Screening of Vladimir Maykov's film \"The Secret of Carlos Castaneda\", followed by an exchange with the group."
 ],
 [
  "05/12/2024",
  "Student's Meeting",
  "",
  "",
  4,
  "-",
  "An evening for the student group without a lecture: organisation of the coming module, peer exchange and space for questions about the training."
 ],
 [
  "09/12/2024",
  "Biotransenergetics 5",
  "Pier Luigi Lattuada",
  "",
  4,
  "Biotransenergetics",
  "Biotransenergetics (BTE), the integral transpersonal approach of Pier Luigi Lattuada, describes human experience as a circuit of thinking, feeling and acting held within the Organismic Self. This session looks at trance as a place of acceptance where all levels of the Organismic Self are in contact, and at breathwork as a way into it."
 ],
 [
  "16/12/2024",
  "Biotransenergetics 6",
  "Pier Luigi Lattuada",
  "",
  4,
  "Biotransenergetics",
  "Biotransenergetics (BTE), the integral transpersonal approach of Pier Luigi Lattuada, describes human experience as a circuit of thinking, feeling and acting held within the Organismic Self. This session presents the primal circle of the counselor (observation, acceptance, awareness) and the therapeutic circle of contact, mobilisation, direction and transformation."
 ],
 [
  "13/01/2025",
  "Biotransenergetics 7",
  "Pier Luigi Lattuada",
  "",
  4,
  "Biotransenergetics",
  "Biotransenergetics (BTE), the integral transpersonal approach of Pier Luigi Lattuada, describes human experience as a circuit of thinking, feeling and acting held within the Organismic Self. This session works with the shadow and with spiritual bypassing: going beyond one's boundaries without having integrated what lies behind them."
 ],
 [
  "20/01/2025",
  "Biotransenergetics 8",
  "Pier Luigi Lattuada",
  "",
  4,
  "Biotransenergetics",
  "Biotransenergetics (BTE), the integral transpersonal approach of Pier Luigi Lattuada, describes human experience as a circuit of thinking, feeling and acting held within the Organismic Self. This session looks at archetypes as forms without content that organise the psyche, and a ceremony to meet the central archetype that drives one's evolution."
 ],
 [
  "03/02/2025",
  "Biotransenergetics 9",
  "Pier Luigi Lattuada",
  "",
  4,
  "Biotransenergetics",
  "Biotransenergetics (BTE), the integral transpersonal approach of Pier Luigi Lattuada, describes human experience as a circuit of thinking, feeling and acting held within the Organismic Self. This session covers the cornerstones of the method: the \"passage from zero\", persistence of contact (not-doing) and mastery of trance."
 ],
 [
  "10/02/2025",
  "Biotransenergetics 10",
  "Pier Luigi Lattuada",
  "",
  5,
  "Biotransenergetics",
  "Biotransenergetics (BTE), the integral transpersonal approach of Pier Luigi Lattuada, describes human experience as a circuit of thinking, feeling and acting held within the Organismic Self. This session uses mudra, mantra and yantra (movement, sound and image) as doors to the archetypes and to the inner parts they can support."
 ],
 [
  "17/02/2025",
  "Biotransenergetics 11",
  "Pier Luigi Lattuada",
  "",
  5,
  "Biotransenergetics",
  "Biotransenergetics (BTE), the integral transpersonal approach of Pier Luigi Lattuada, describes human experience as a circuit of thinking, feeling and acting held within the Organismic Self. This session presents the triunity process: making the two one, so that the client stops fighting an issue in dualistic terms and a third, broader perspective can emerge."
 ],
 [
  "24/02/2025",
  "Biotransenergetics 12",
  "Pier Luigi Lattuada",
  "",
  5,
  "Biotransenergetics",
  "Biotransenergetics (BTE), the integral transpersonal approach of Pier Luigi Lattuada, describes human experience as a circuit of thinking, feeling and acting held within the Organismic Self. The closing session places the method in its history, alongside Gestalt therapy, Jungian psychology and humanistic-existential psychology."
 ],
 [
  "04/03/2025",
  "Hypnotherapy/ Working with the Inner Child, Supervision Part I",
  "Prof. Jure Biechonski",
  "",
  5,
  "Hypnotherapy and the Inner Child",
  "Jure Biechonski's hypnotherapy series on working with the inner child: guided trance to reach early experiences and patterns, combined with supervision of the participants' own practice. Part I: the basics of trance work and the first encounter with the inner child."
 ],
 [
  "11/03/2025",
  "Hypnotherapy/ Working with the Inner Child, Supervision Part II",
  "Prof. Jure Biechonski",
  "",
  5,
  "Hypnotherapy and the Inner Child",
  "Jure Biechonski's hypnotherapy series on working with the inner child: guided trance to reach early experiences and patterns, combined with supervision of the participants' own practice. Part II: going deeper into early experiences, and how the adult self can offer the child what was missing."
 ],
 [
  "18/03/2025",
  "Hypnotherapy/ Working with the Inner Child, Supervision Part III",
  "Prof. Jure Biechonski",
  "",
  5,
  "Hypnotherapy and the Inner Child",
  "Jure Biechonski's hypnotherapy series on working with the inner child: guided trance to reach early experiences and patterns, combined with supervision of the participants' own practice. Part III: practice in small groups and supervision of the sessions."
 ],
 [
  "01/04/2025",
  "Hypnotherapy/ Working with the Inner Child, Supervision Part IV",
  "Prof. Jure Biechonski",
  "",
  5,
  "Hypnotherapy and the Inner Child",
  "Jure Biechonski's hypnotherapy series on working with the inner child: guided trance to reach early experiences and patterns, combined with supervision of the participants' own practice. Part IV: integrating the work with the inner child into everyday life and further supervision."
 ],
 [
  "08/04/2025",
  "About Meditation 1",
  "Dr. Tina Lindhard",
  "",
  5,
  "Meditation and Heart-Based Therapy (Arka Dhyana)",
  "Tina Lindhard's series on meditation and heart-based practice: this first evening introduces what meditation is, why it matters for anyone who accompanies others into non-ordinary states, and how to begin a steady practice."
 ],
 [
  "14/04/2025",
  "Hypnotherapy/ Working with the Inner Child, Supervision Part V",
  "Prof. Jure Biechonski",
  "",
  5,
  "Hypnotherapy and the Inner Child",
  "Jure Biechonski's hypnotherapy series on working with the inner child: guided trance to reach early experiences and patterns, combined with supervision of the participants' own practice. Part V, the closing session: review of the method, open questions and final supervision."
 ],
 [
  "29/04/2025",
  "Healing the Ego",
  "Bernadette Blin",
  "",
  5,
  "Foundations of Transpersonal Psychotherapy",
  "Bernadette Blin on healing the ego: not fighting or dissolving the ego, but recognising its wounds and defences so that it can become a healthy, flexible servant of the deeper Self."
 ],
 [
  "06/05/2025",
  "Stan Grof – his life",
  "Kati Wortelkamp",
  "",
  5,
  "Stanislav Grof's Map of the Psyche",
  "Kati Wortelkamp on the life of Stanislav Grof: from his early LSD research in Prague to the discovery of Holotropic Breathwork with Christina Grof, and his role in founding transpersonal psychology."
 ],
 [
  "13/05/2025",
  "Strategic sessions in Psychotherapy I",
  "Lyudmila Skartsesku",
  "",
  6,
  "Transpersonal Counseling Skills and the Counseling Process",
  "Lyudmila Skartsesku on strategic sessions in psychotherapy: how to structure a session around a clear request, choose interventions with a purpose, and guide the process towards a concrete result."
 ],
 [
  "20/05/2025",
  "Strategic sessions in Psychotherapy II",
  "Lyudmila Skartsesku",
  "",
  6,
  "Transpersonal Counseling Skills and the Counseling Process",
  "Second part on strategic sessions: practice in pairs on how the counselor shapes the course of a session and works with the client's resources."
 ],
 [
  "27/05/2025",
  "The constellation as a transpersonal and embodied externalisation/visual representation of a system within a physical space",
  "Erik Andersen",
  "Cathy Geils",
  6,
  "Family Constellations in the Group",
  "A lecture series with Erik Andersen and Dr. Cathy Geils on systemic constellation work. This first evening presents the constellation as a transpersonal and embodied representation of a system in physical space."
 ],
 [
  "03/06/2025",
  "Representative perception, the knowing field and systemic awareness",
  "Erik Andersen",
  "Cathy Geils",
  6,
  "Family Constellations in the Group",
  "A lecture series with Erik Andersen and Dr. Cathy Geils on systemic constellation work. On representative perception: how representatives sense the system they stand for, the \"knowing field\", and systemic awareness."
 ],
 [
  "10/06/2025",
  "The orders of love",
  "Erik Andersen",
  "Cathy Geils",
  6,
  "Family Constellations in the Group",
  "A lecture series with Erik Andersen and Dr. Cathy Geils on systemic constellation work. On Bert Hellinger's \"orders of love\": belonging, balance of giving and taking, and order in family systems, and what happens when they are disturbed."
 ],
 [
  "17/06/2025",
  "Healing sentences and movements",
  "Erik Andersen",
  "Cathy Geils",
  6,
  "Family Constellations in the Group",
  "A lecture series with Erik Andersen and Dr. Cathy Geils on systemic constellation work. On healing sentences and movements: the words and gestures that allow what was excluded to be acknowledged and the system to find a new order."
 ],
 [
  "24/06/2025",
  "About Meditation 2",
  "Dr. Tina Lindhard",
  "",
  6,
  "Meditation and Heart-Based Therapy (Arka Dhyana)",
  "Tina Lindhard's series on meditation and heart-based practice: this second evening deepens the practice and looks at what meditation does to attention, emotion and the sense of self."
 ],
 [
  "08/07/2025",
  "Student's Meeting",
  "",
  "",
  6,
  "-",
  "An evening for the student group without a lecture: organisation of the coming module, peer exchange and space for questions about the training."
 ],
 [
  "15/07/2025",
  "About Meditation 3",
  "Dr. Tina Lindhard",
  "",
  6,
  "Meditation and Heart-Based Therapy (Arka Dhyana)",
  "Tina Lindhard's series on meditation and heart-based practice: this third evening brings the practice into the therapeutic relationship and into the work with non-ordinary states."
 ],
 [
  "12/08/2025",
  "About the breath",
  "Kati Wortelkamp",
  "",
  6,
  "Holotropic States of Consciousness and their Healing Potential",
  "Kati Wortelkamp on the breath: its physiology, its role in emotion and the nervous system, and why accelerated breathing opens access to non-ordinary states in Holotropic Breathwork."
 ],
 [
  "19/08/2025",
  "Stan Grof's expanded map of consciousness",
  "Kati Wortelkamp",
  "",
  6,
  "Stanislav Grof's Map of the Psyche",
  "Kati Wortelkamp on Stanislav Grof's expanded cartography of the psyche: the biographical, perinatal and transpersonal levels, and how experiences in non-ordinary states can be understood within it."
 ],
 [
  "26/08/2025",
  "Stan Grof's Theory of the COEX-Systems",
  "Kati Wortelkamp",
  "",
  6,
  "Stanislav Grof's Map of the Psyche",
  "Kati Wortelkamp on Grof's COEX systems (systems of condensed experience): constellations of memories with the same emotional charge, how they shape perception and behaviour, and how they surface in breathwork."
 ],
 [
  "02/09/2025",
  "Psychosynthesis I",
  "Charlotte Kihl",
  "",
  6,
  "Psychosynthesis",
  "Charlotte Kihl introduces Psychosynthesis, Roberto Assagioli's model of the psyche: the egg diagram, subpersonalities, and the personal and higher Self."
 ],
 [
  "09/09/2025",
  "Psychosynthesis II",
  "Charlotte Kihl",
  "",
  6,
  "Psychosynthesis",
  "Second part on Psychosynthesis: disidentification exercises, working with subpersonalities, and the role of the will in personal and transpersonal growth."
 ],
 [
  "23/09/2025",
  "Student's Meeting and Psychosynthesis III",
  "Charlotte Kihl",
  "",
  6,
  "Psychosynthesis",
  "Students' meeting followed by the third part on Psychosynthesis: integrating what was explored during the intensive in Todtmoos."
 ],
 [
  "30/09/2025",
  "The 12 pillars of Transpersonal Psychotherapy",
  "Bernadette Blin",
  "",
  7,
  "Foundations of Transpersonal Psychotherapy",
  "Bernadette Blin on the twelve pillars of transpersonal psychotherapy: the principles that distinguish a transpersonal approach, from the view of the person as more than their history to the place of spiritual experience in healing."
 ],
 [
  "07/10/2025",
  "Collective Trauma",
  "Samvedam B. Randles",
  "",
  7,
  "Collective and Transgenerational Trauma",
  "On collective trauma: how wars, persecution, migration and social upheaval leave traces that are carried by groups and passed down generations, and how they show up in individual work and can be integrated."
 ],
 [
  "14/10/2025",
  "Spiritual Journey using heart based Meditation",
  "Dr. Tina Lindhard",
  "",
  7,
  "Meditation and Heart-Based Therapy (Arka Dhyana)",
  "Tina Lindhard's series on meditation and heart-based practice: on the spiritual journey with heart-based meditation, and how the heart's felt sense guides the path."
 ],
 [
  "28/10/2025",
  "Therapy and Spiritual Journey",
  "Dr. Tina Lindhard",
  "",
  7,
  "Meditation and Heart-Based Therapy (Arka Dhyana)",
  "Tina Lindhard's series on meditation and heart-based practice: on how therapy and a spiritual journey relate: where ego-strengthening work is needed, and where transpersonal work invites something beyond it."
 ],
 [
  "04/11/2025",
  "Kundalini",
  "Dr. Tina Lindhard",
  "",
  7,
  "Meditation and Heart-Based Therapy (Arka Dhyana)",
  "Tina Lindhard's series on meditation and heart-based practice: on Kundalini: the traditional teachings, how its awakening may show up in the body and psyche, and how to accompany it safely."
 ],
 [
  "11/11/2025",
  "Perpetrator-victim structure from a transpersonal perspective",
  "Dr. Stefan Dressler",
  "",
  7,
  "Psychopathology from a Transpersonal Point of View",
  "Dr. Stefan Dressler on the perpetrator-victim structure from a transpersonal perspective: one of the most common relational patterns, its roots in early relational trauma, and ways out of it."
 ],
 [
  "18/11/2025",
  "Transpersonal Psychology and Psychotherapy",
  "Gabriel Fernandez-Borsot, PhD",
  "",
  7,
  "Foundations of Transpersonal Psychotherapy",
  "Gabriel Fernandez-Borsot on transpersonal psychology and psychotherapy: the history and main currents of the field, and what a transpersonal orientation changes in clinical practice."
 ],
 [
  "25/11/2025",
  "Regression Therapy as a Healing Tool I – with Practice",
  "Vera Covaliciuc",
  "",
  7,
  "Regression Therapy",
  "Vera Covaliciuc on regression therapy as a healing tool: part I, the principles of the method and how regression gives access to forgotten or unconscious experiences, with practice."
 ],
 [
  "02/12/2025",
  "Regression Therapy as a Healing Tool II – with Practice",
  "Vera Covaliciuc",
  "",
  7,
  "Regression Therapy",
  "Vera Covaliciuc on regression therapy as a healing tool: part II, guiding a regression safely and working with what emerges, with practice."
 ],
 [
  "09/12/2025",
  "Regression Therapy as a Healing Tool III – with Practice",
  "Vera Covaliciuc",
  "",
  7,
  "Regression Therapy",
  "Vera Covaliciuc on regression therapy as a healing tool: part III, integrating regression experiences into the client's present life, with practice."
 ],
 [
  "16/12/2025",
  "Regression Therapy as a Healing Tool IV – with Practice",
  "Vera Covaliciuc",
  "",
  7,
  "Regression Therapy",
  "Vera Covaliciuc on regression therapy as a healing tool: part IV, case discussion, limits and contraindications of the method, and closing practice."
 ],
 [
  "10/03/2026",
  "Student's Meeting",
  "",
  "",
  8,
  "-",
  "An evening for the student group without a lecture: organisation of the coming module, peer exchange and space for questions about the training."
 ],
 [
  "07/07/2026",
  "Student's Meeting",
  "",
  "",
  10,
  "-",
  "An evening for the student group without a lecture: organisation of the coming module, peer exchange and space for questions about the training."
 ]
];

function addPastLecturesAndModules() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Lectures');
  var tz = Session.getScriptTimeZone();
  var h = headerMap_(sheet);
  var col = function (k) { return h[k] + 1; };
  var keyOf = function (d, title) {
    var ds = d instanceof Date ? Utilities.formatDate(d, tz, 'dd/MM/yyyy') : String(d || '').trim();
    return ds + '|' + String(title || '').trim();
  };

  // 1 — modules from the backup
  var restored = 0;
  var backup = ss.getSheetByName('Lectures' + RS_BACKUP_SUFFIX_);
  if (backup) {
    var bh = headerMap_(backup);
    var bv = backup.getDataRange().getValues();
    var moduleOf = {};
    for (var i = 1; i < bv.length; i++) {
      var mod = bv[i][bh['module']];
      if (mod !== '' && mod !== null) moduleOf[keyOf(bv[i][bh['date']], bv[i][bh['title']])] = Number(mod);
    }
    var last = sheet.getLastRow();
    if (last > 1) {
      var v = sheet.getRange(2, 1, last - 1, sheet.getLastColumn()).getValues();
      var mods = sheet.getRange(2, col('module'), last - 1, 1).getValues();
      for (var r = 0; r < v.length; r++) {
        if (mods[r][0] !== '' && mods[r][0] !== null) continue;
        var found = moduleOf[keyOf(v[r][h['date']], v[r][h['title']])];
        if (found) { mods[r][0] = found; restored++; }
      }
      sheet.getRange(2, col('module'), last - 1, 1).setValues(mods);
    }
  }

  // 2 — past lectures
  var existing = {};
  var descFor = {};
  PAST_LECTURES_.forEach(function (l) { descFor[l[0] + '|' + l[1]] = l[6]; });
  var lastRow = sheet.getLastRow();
  var described = 0;
  if (lastRow > 1) {
    var cur = sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).getValues();
    var descCol = sheet.getRange(2, col('description'), lastRow - 1, 1);
    var descs = descCol.getValues();
    cur.forEach(function (row, i) {
      var k = keyOf(row[h['date']], row[h['title']]);
      existing[k] = true;
      if (!String(descs[i][0] || '').trim() && descFor[k]) { descs[i][0] = descFor[k]; described++; }
    });
    if (described) descCol.setValues(descs);
  }
  var width = sheet.getLastColumn();
  var toAdd = [];
  PAST_LECTURES_.forEach(function (l) {
    if (existing[l[0] + '|' + l[1]]) return;
    var p = l[0].split('/');
    var row = new Array(width).fill('');
    row[h['date']] = new Date(Number(p[2]), Number(p[1]) - 1, Number(p[0]));
    row[h['title']] = l[1];
    row[h['teacher 1']] = l[2];
    row[h['teacher 2']] = l[3];
    row[h['module']] = l[4];
    row[h['topic']] = l[5];
    row[h['description']] = l[6];
    toAdd.push(row);
  });
  if (toAdd.length) sheet.getRange(sheet.getLastRow() + 1, 1, toAdd.length, width).setValues(toAdd);

  // 3 — topics and teachers into the pools, then order by date
  var lists = ss.getSheetByName('Lists');
  var topics = lists.getRange(2, 4, Math.max(lists.getLastRow() - 1, 1), 1).getDisplayValues()
    .map(function (x) { return x[0]; }).filter(function (x) { return x; });
  var newTopics = [];
  PAST_LECTURES_.forEach(function (l) {
    if (topics.indexOf(l[5]) < 0 && newTopics.indexOf(l[5]) < 0) newTopics.push(l[5]);
  });
  var allTopics = topics.concat(newTopics).sort(function (a, b) { return a === '-' ? -1 : b === '-' ? 1 : a.localeCompare(b); });
  lists.getRange(2, 4, allTopics.length, 1).setValues(allTopics.map(function (x) { return [x]; }));

  var teachers = ss.getSheetByName('Teachers');
  var pool = teachers.getRange(2, 1, Math.max(teachers.getLastRow() - 1, 1), 1).getDisplayValues().map(function (x) { return x[0]; });
  var missing = [];
  PAST_LECTURES_.forEach(function (l) {
    [l[2], l[3]].forEach(function (n) { if (n && pool.indexOf(n) < 0 && missing.indexOf(n) < 0) missing.push(n); });
  });
  if (missing.length) teachers.getRange(teachers.getLastRow() + 1, 1, missing.length, 1).setValues(missing.map(function (x) { return [x]; }));

  var body = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn());
  body.sort({ column: col('date'), ascending: true });
  formatSheets();

  var semMsg = addPastSeminars_(ss);
  var msg = semMsg + '; ' + restored + ' modules restored, ' + toAdd.length + ' past lectures added, ' + described + ' descriptions filled, ' + newTopics.length + ' new topics in Lists' +
            (missing.length ? ', added to Teachers: ' + missing.join(', ') : '') + '.';
  Logger.log(msg);
  try { SpreadsheetApp.getUi().alert('Past lectures', msg, SpreadsheetApp.getUi().ButtonSet.OK); } catch (e) {}
}

/* ── Seminars from the old programmes ───────────────────────────────
   Two dates corrected against West_Program_25 (the Rainer Pervöltz
   intensive and the option weekend before it were in July, not June; their
   slugs follow, those pages were only ever on staging), and seven past
   seminars that were missing from the tab. "Mexico" joins the Venues tab. */

// [old slug, new date, new slug]
var PAST_SEMINAR_FIXES_ = [
 [
  "intensive-healing-the-inner-child-grof-breathwork-freiburg-todtmoos-2025-06-03",
  "03.07.2025 - 06.07.2025",
  "intensive-healing-the-inner-child-grof-breathwork-freiburg-todtmoos-2025-07-03"
 ],
 [
  "double-holotropic-breathwork-freiburg-todtmoos-2025-06-01",
  "01.07.2025 - 03.07.2025",
  "double-holotropic-breathwork-freiburg-todtmoos-2025-07-01"
 ]
];
// [date, title, facilitator 1, 2, 3, location, type1, type2, module, description, slug]
var PAST_SEMINARS_ = [
 [
  "18.05.2024",
  "Option: Holotropic Breathwork (Riga)",
  "Lyudmila Skartsesku",
  "",
  "",
  "Riga",
  "Holotropic Breathwork",
  "",
  "-",
  "A weekend built around one Holotropic Breathwork session, with participants alternating as breather and sitter. Accelerated breathing, evocative music and bodywork open access to non-ordinary states for healing, followed by mandala drawing and group sharing.",
  "holotropic-breathwork-riga-2024-05-18"
 ],
 [
  "02.05.2025 - 04.05.2025",
  "Option: Double Holotropic Breathwork (Riga)",
  "Lyudmila Skartsesku",
  "",
  "",
  "Riga",
  "Holotropic Breathwork",
  "",
  "-",
  "A weekend built around two Holotropic Breathwork sessions, with participants alternating as breather and sitter. Grof's method of accelerated breathing, music and bodywork opens access to non-ordinary states for healing, followed by mandala drawing and group sharing.",
  "double-holotropic-breathwork-riga-2025-05-02"
 ],
 [
  "08.08.2025 - 10.08.2025",
  "Option: Triple Holotropic Breathwork (Riga)",
  "Kati Wortelkamp",
  "",
  "",
  "Riga",
  "Holotropic Breathwork",
  "",
  "-",
  "An intensive weekend offering three Holotropic Breathwork sessions, with participants rotating through the roles of breather and sitter. Repeated breathwork allows deeper, more sustained access to non-ordinary states, with group sharing and mandala work after each session.",
  "triple-holotropic-breathwork-riga-2025-08-08"
 ],
 [
  "28.08.2025 - 31.08.2025",
  "Option: Double Holotropic Breathwork",
  "Kati Wortelkamp",
  "Ursula Boger",
  "",
  "Todtmoos",
  "Holotropic Breathwork",
  "",
  "-",
  "A weekend built around two Holotropic Breathwork sessions, with participants alternating as breather and sitter. Grof's method of accelerated breathing, music and bodywork opens access to non-ordinary states for healing, followed by mandala drawing and group sharing.",
  "double-holotropic-breathwork-freiburg-todtmoos-2025-08-28"
 ],
 [
  "21.10.2025 - 26.10.2025",
  "EUROTAS International Transpersonal Conference (Mexico)",
  "",
  "",
  "",
  "Mexico",
  "Conference",
  "",
  "-",
  "The 2025 EUROTAS International Transpersonal Conference in Mexico: a gathering of the international transpersonal community with keynotes, workshops and experiential sessions. No lectures took place in the training that week.",
  "eurotas-international-transpersonal-conference-mexico-2025-10-21"
 ],
 [
  "07.11.2025 - 09.11.2025",
  "Option: Double Holotropic Breathwork (Riga)",
  "Lyudmila Skartsesku",
  "",
  "",
  "Riga",
  "Holotropic Breathwork",
  "",
  "-",
  "A weekend built around two Holotropic Breathwork sessions, with participants alternating as breather and sitter. Grof's method of accelerated breathing, music and bodywork opens access to non-ordinary states for healing, followed by mandala drawing and group sharing.",
  "double-holotropic-breathwork-riga-2025-11-07"
 ],
 [
  "12.12.2025 - 14.12.2025",
  "Option: Grof® Breathwork (Todtmoos)",
  "Kati Wortelkamp",
  "",
  "",
  "Todtmoos",
  "Holotropic Breathwork",
  "",
  "-",
  "A weekend built around one Holotropic Breathwork session, with participants alternating as breather and sitter. Accelerated breathing, evocative music and bodywork open access to non-ordinary states for healing, followed by mandala drawing and group sharing.",
  "grof-breathwork-freiburg-todtmoos-2025-12-12"
 ]
];

// Fuller descriptions for the distinctive intensives (from the seminar notes).
var SEMINAR_DESCRIPTIONS_ = {
 "intensive-grof-breathwork-freiburg-todtmoos-2024-02-29": "The first residential intensive of the 2024 cohort, in Todtmoos with Kati Wortelkamp and Lyudmila Skartsesku. Daily Holotropic Breathwork sessions, with participants alternating as breather and sitter: Grof's combination of accelerated breathing, evocative music and focused bodywork opens access to non-ordinary states for healing and self-exploration. Mandala drawing and group sharing after each session help to integrate what emerges, and the days lay the ground for working together as a group over the four years of the training.",
 "intensive-grof-breathwork-freiburg-todtmoos-2024-11-28": "A residential intensive in Todtmoos with Kati Wortelkamp, Mario Lorenzetti and Stephan Schillinger, closing the first year of the training. Daily Holotropic Breathwork sessions, alternating breather and sitter roles, are framed by a group ceremony: ritual and shared presence as a container for what the breathwork brings up, and for integrating the experiences of the year.",
 "intensive-from-regression-to-progression-freiburg-todtmoos-2025-02-21": "Jure Biechonski's seminar \"From Regression to Progression\": looking back at childhood not to analyse it but as a tool for moving forward. Problems are approached as normal reactions to difficult situations, created by the imagination and therefore open to change through it. Guided visualisations to meet the inner child, empty-chair dialogues, the Karpman drama triangle of rescuer, victim and persecutor, a living picture of the childhood family system and work with metaphoric cards are combined with group sharing, always working with the healthy part of the person rather than the illness. The intensive follows an optional Grof Breathwork weekend in the same house.",
 "intensive-healing-the-inner-child-grof-breathwork-freiburg-todtmoos-2025-07-03": "Rainer Pervöltz's intensive on \"The Central\": the early defensive organisation that forms around childhood wounding, the \"Old Central\", and the untouched core it protects, the Essence. Combined with Holotropic Breathwork, the work uses bodywork, presence and non-judgment to reach these early layers. The therapist's role is guidance, not solutions: meeting the inner child with acceptance so that old survival strategies can soften and the person can act from the Essence rather than from the wound.",
 "intensive-the-central-drama-holotropic-breathwork-freiburg-todtmoos-2025-11-20": "Dr. Stefan Dressler's seminar \"Working with the Central Drama\", with one Holotropic Breathwork session. It explores the perpetrator-victim structure, perhaps the most demanding pattern we create in relationships: in a conflict almost everyone experiences themselves as the victim. The seminar traces it to early childhood, to the growing separation from the mother and the two core relational traumas of invasion and abandonment, which lead to opposite strategies of keeping distance or clinging. Experiential work helps participants recognise their own central drama and step out of the pattern.",
 "intensive-harmony-in-shadows-holotropic-breathwork-freiburg-todtmoos-2026-03-04": "Nicolas Cambas's trauma-work seminar \"Harmony in Shadows\", paired with daily Holotropic Breathwork. Starting from a Jungian map of the psyche (Self, ego, persona, the shadow and the complexes of the personal unconscious, the archetypes of the collective one), it treats the shadow not as something negative but as a vault of suppressed vitality and power. Because the shadow cannot be seen directly, the work approaches it through its mechanisms: projections, emotional triggers and repeated patterns. Mostly experiential and body-based, it brings disowned parts back into relationship with the rest of the self rather than fighting them.",
 "intensive-psychosintesis-freiburg-todtmoos-2025-09-19": "Charlotte Kihl introduces Psychosynthesis, Roberto Assagioli's model of the psyche built around subpersonalities and a unifying higher Self, after a Double Holotropic Breathwork in the same house. Disidentification exercises help participants recognise and integrate their different inner parts and explore the role of the will in personal and transpersonal growth. The intensive continues the online lectures on Psychosynthesis given in September."
};

function addPastSeminars_(ss) {
  var sheet = ss.getSheetByName('Seminars');
  var h = headerMap_(sheet);
  var venues = ss.getSheetByName('Venues');
  var known = venues.getRange(2, 1, Math.max(venues.getLastRow() - 1, 1), 1).getDisplayValues().map(function (x) { return x[0]; });
  if (known.indexOf('Mexico') < 0) {
    venues.getRange(venues.getLastRow() + 1, 1, 1, 8).setValues([['Mexico', '', '', '', 'Mexico', '', 'https://www.google.com/maps/search/?api=1&query=Mexico', '']]);
  }
  var last = sheet.getLastRow();
  var v = sheet.getRange(1, 1, last, sheet.getLastColumn()).getDisplayValues();
  var slugRow = {};
  for (var i = 1; i < v.length; i++) slugRow[String(v[i][h['slug']]).trim()] = i + 1;
  var fixed = 0, added = 0;
  PAST_SEMINAR_FIXES_.forEach(function (f) {
    var row = slugRow[f[0]];
    if (!row) return;
    sheet.getRange(row, h['date'] + 1).setValue(f[1]);
    sheet.getRange(row, h['slug'] + 1).setValue(f[2]);
    slugRow[f[2]] = row;
    fixed++;
  });
  var described = 0;
  Object.keys(SEMINAR_DESCRIPTIONS_).forEach(function (slug) {
    var row = slugRow[slug];
    if (!row) return;
    sheet.getRange(row, h['description'] + 1).setValue(SEMINAR_DESCRIPTIONS_[slug]);
    described++;
  });
  var keys = ['date', 'title', 'facilitator 1', 'facilitator 2', 'facilitator 3', 'location', 'type1', 'type2', 'ewtt - module', 'description', 'slug'];
  var width = sheet.getLastColumn();
  var out = [];
  PAST_SEMINARS_.forEach(function (s) {
    if (slugRow[s[10]]) return;
    var row = new Array(width).fill('');
    keys.forEach(function (k, j) { if (k in h) row[h[k]] = s[j]; });
    out.push(row);
  });
  if (out.length) {
    var start = sheet.getLastRow() + 1;
    sheet.getRange(start, h['date'] + 1, out.length, 1).setNumberFormat('@');
    sheet.getRange(start, 1, out.length, width).setValues(out);
    added = out.length;
  }
  return fixed + ' seminar dates corrected, ' + added + ' past seminars added, ' + described + ' seminar descriptions expanded';
}
