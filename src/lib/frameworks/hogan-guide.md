<?xml version="1.0" encoding="UTF-8"?>

<hogan_interpretation_guide version="1.0">

  <!-- ============================================================
       SECTION 1: FOUNDATIONS
       ============================================================ -->
  <foundations>
    <overview>
      Hogan Assessments measure personality from three perspectives to predict
      workplace performance. They measure REPUTATION (how others see the person),
      not IDENTITY (how the person sees themselves). This distinction is critical
      for interpretation and feedback delivery.
    </overview>

    <three_assessments>
      <assessment name="HPI" full_name="Hogan Personality Inventory">
        <label>The Bright Side</label>
        <measures>Everyday personality — strengths and challenges visible in day-to-day behavior</measures>
        <basis>Five-Factor Model of personality</basis>
        <scale_count>7 primary scales, 42 subscales</scale_count>
        <completion_time>15-20 minutes</completion_time>
        <published>1986</published>
      </assessment>
      <assessment name="HDS" full_name="Hogan Development Survey">
        <label>The Dark Side</label>
        <measures>Performance risks that emerge under stress, boredom, complacency, or when not self-monitoring</measures>
        <basis>Outside the Five-Factor Model; based on clinical personality disorder constructs adapted for normal populations</basis>
        <scale_count>11 primary scales, 33 subscales</scale_count>
        <completion_time>15-20 minutes</completion_time>
        <published>1997</published>
      </assessment>
      <assessment name="MVPI" full_name="Motives, Values, Preferences Inventory">
        <label>The Inside</label>
        <measures>Core goals, values, drivers, and interests — what a person desires and strives to attain</measures>
        <scale_count>10 primary scales, 50 subscales (5 per scale)</scale_count>
        <completion_time>15-20 minutes</completion_time>
      </assessment>
    </three_assessments>

    <how_they_work_together>
      The MVPI describes what a person values and strives to attain.
      The HPI highlights characteristics that will facilitate goal attainment.
      The HDS highlights characteristics capable of impeding success.
      Values (MVPI) powerfully influence how HPI and HDS behaviors show up in the real world.
    </how_they_work_together>

    <scoring_bands>
      <hpi_bands type="three_level">
        <band name="Low" range="0-35" />
        <band name="Average" range="36-64" />
        <band name="High" range="65-100" />
      </hpi_bands>
      <hpi_bands type="four_level">
        <band name="Low" range="0-25" />
        <band name="Below Average" range="26-50" />
        <band name="Above Average" range="51-75" />
        <band name="High" range="76-100" />
      </hpi_bands>
      <hds_bands>
        <band name="No Risk" range="0-39" />
        <band name="Low Risk" range="40-69" />
        <band name="Moderate Risk" range="70-89" />
        <band name="High Risk" range="90-100" />
      </hds_bands>
      <mvpi_bands type="three_level">
        <band name="Low" range="0-35" />
        <band name="Average" range="36-64" />
        <band name="High" range="65-100" />
      </mvpi_bands>
      <mvpi_bands type="four_level">
        <band name="Low" range="0-25" />
        <band name="Below Average" range="26-50" />
        <band name="Above Average" range="51-75" />
        <band name="High" range="76-100" />
      </mvpi_bands>
    </scoring_bands>

    <validity_scale>
      The HPI includes a Validity scale that checks regularity of response patterns.
      Interpret as pass/fail. Four bars = pass (consistent, typical, careful responding).
      Zero bars = fail (inconsistent, atypical, or inattentive responding).
      IMPORTANT: Invalid does NOT equal uninterpretable. Consider the assessment context.
      In selection: use as-is for fairness; optionally allow all candidates to reassess.
      In development: confirm the person was attentive; if so, interpret as-is; if not, reassess.
    </validity_scale>

    <extreme_scores_warning>
      Extremely high scores (above 90th percentile) or extremely low scores (below 10th
      percentile) on the HPI suggest the respondent may demonstrate extreme response
      tendencies that can hinder performance. Flag these for discussion.
    </extreme_scores_warning>

  </foundations>

  <!-- ============================================================
       SECTION 2: HPI — THE BRIGHT SIDE
       ============================================================ -->
  <hpi>
    <interpretation_principles>
      <principle>High scores are NOT good and low scores are NOT bad. There is no good or bad profile.</principle>
      <principle>There are strengths and development areas for ALL score ranges.</principle>
      <principle>Context matters: scores that predict success in one job may be detrimental in another.</principle>
      <principle>Subscales tell the deeper story when main scales are average or low.</principle>
      <principle>The HPI maps to the Five-Factor Model: Adjustment=Emotional Stability, Ambition+Sociability=Extraversion, Interpersonal Sensitivity=Agreeableness, Prudence=Dependability, Inquisitive+Learning Approach=Openness to Experience.</principle>
    </interpretation_principles>

    <scale name="Adjustment">
      <measures>Degree to which a person appears confident, self-accepting, and stable under pressure</measures>
      <insight>Resilience</insight>
      <low_score>
        <reputation>Self-critical, emotional, stress-prone</reputation>
        <behaviors>Admits shortcomings and tries to fix them; remembers mistakes; worries about performance; takes criticism personally; seems moody and easily irritated</behaviors>
        <team_strengths>Considerable energy and passion; rarely complacent; alert to external threats; never arrogant about competition</team_strengths>
      </low_score>
      <average_score>
        <behaviors>Calm in stressful situations; listens to criticism without taking it personally; understands own strengths and shortcomings; learns from mistakes; patient with staff</behaviors>
      </average_score>
      <high_score>
        <reputation>Calm, even-tempered, resistant to negative feedback</reputation>
        <behaviors>Handles pressure well; does not take criticism personally; expects to succeed; hard to coach; overlooks mistakes</behaviors>
        <shortcomings>Feedback resistant and arrogant</shortcomings>
        <team_strengths>Great persistence and resilience; few mistakes from overreacting; rarely inhibited by emotional outbursts; rarely demoralized</team_strengths>
      </high_score>
      <subscales>
        <subscale name="Empathy" low="Irritated by others' faults" high="Empathic toward others' shortcomings" />
        <subscale name="Not Anxious" low="Anxious or tense" high="Relaxed, seldom anxious" />
        <subscale name="No Guilt" low="Worries about past mistakes" high="Does not dwell on or regret past mistakes" />
        <subscale name="Calmness" low="Emotional at times" high="Calm and collected" />
        <subscale name="Even Tempered" low="Temperamental or moody" high="Even-tempered with stable moods" />
        <subscale name="No Complaints" low="Frequent complaints" high="Infrequent complaints" />
        <subscale name="Trusting" low="Questions others' intentions" high="Trusting, not suspicious" />
        <subscale name="Good Attachment" low="Hostile to authority" high="Positive attitude toward authority" />
      </subscales>
      <subscale_guidance>
        Empathy, Not Anxious, No Guilt, Calmness = internal churn (stress not easily visible to others).
        Even Tempered, No Complaints, Trusting, Good Attachment = external churn (visible stress manifestation).
        If the participant has a low or average Adjustment score, subscale scores become MORE important for interpretation.
      </subscale_guidance>
    </scale>

    <scale name="Ambition">
      <measures>Degree to which a person seems socially self-confident, leader-like, competitive, and energetic</measures>
      <insight>Drive and Energy</insight>
      <low_score>
        <behaviors>Lets others take charge; finesses rather than confronts; good team player; noncompetitive; flexible agenda; reluctant to speak in public</behaviors>
        <team_strengths>Works well together with few rivalries; cooperates with other units; doesn't pressure one another</team_strengths>
      </low_score>
      <high_score>
        <behaviors>Enjoys taking charge and making decisions; accepts difficult challenges; enjoys public speaking; intimidates junior people; eager to advance; competes with others</behaviors>
        <shortcomings>Intimidating to and competitive with others</shortcomings>
        <team_strengths>Hardworking, energetic, eager to outperform; takes initiative; approaches problems confidently</team_strengths>
      </high_score>
      <subscales>
        <subscale name="Competitive" low="Laidback" high="Competitive and determined to get ahead" />
        <subscale name="Self Confidence" low="Lacking in confidence" high="Confident" />
        <subscale name="Accomplishment" low="Unhappy with accomplishments" high="Enjoyment of self and work" />
        <subscale name="Leadership" low="Reluctant to assume leadership" high="Willing to assume authority positions" />
        <subscale name="Identity" low="Lacking career direction" high="Focused career direction" />
        <subscale name="No Social Anxiety" low="Socially retiring" high="Confident in social settings" />
      </subscales>
    </scale>

    <scale name="Sociability">
      <measures>Degree to which a person seems to need and enjoy interacting with others</measures>
      <insight>Social Style</insight>
      <low_score>
        <behaviors>Listens more than talks; works by themselves; task-oriented; prefers formal meetings; may not give enough feedback</behaviors>
        <team_strengths>Members listen to each other; task-oriented and focused; start and end meetings on time</team_strengths>
      </low_score>
      <high_score>
        <behaviors>Busy and full of energy; talkative, friendly, approachable; builds wide relationships; talks rather than listens; confuses activity with productivity; distractible</behaviors>
        <shortcomings>Flighty and distractible</shortcomings>
        <team_strengths>Active communication; enjoys meetings; zest and energy</team_strengths>
      </high_score>
      <subscales>
        <subscale name="Likes Parties" low="Does not enjoy social gatherings" high="Enjoys social gatherings" />
        <subscale name="Likes Crowds" low="Prefers smaller groups" high="Enjoys large groups" />
        <subscale name="Experience Seeking" low="Unadventurous" high="Adventurous, seeks new experiences" />
        <subscale name="Exhibitionistic" low="Avoids limelight" high="Attention-seeking" />
        <subscale name="Entertaining" low="Not particularly entertaining" high="Charming, amusing, good humor" />
      </subscales>
      <subscale_guidance>First three subscales = frequency of social situations; last two = social engagement behaviors. Interpret mainly at the main scale level.</subscale_guidance>
    </scale>

    <scale name="Interpersonal Sensitivity">
      <measures>Degree to which a person is seen as perceptive, tactful, and socially sensitive</measures>
      <insight>Communication Style</insight>
      <low_score>
        <behaviors>Confronts poor performers; takes and maintains unpopular positions; enforces standards; uncompromising; forceful about agendas</behaviors>
        <shortcomings_of_low>Objective and candid</shortcomings_of_low>
        <team_strengths>Very task-oriented; no groupthink; honest communications; not afraid to confront low performers</team_strengths>
      </low_score>
      <high_score>
        <behaviors>Pleasant and rewarding to deal with; socially appropriate; reads social cues; promises more than delivers; avoids confrontations</behaviors>
        <shortcomings>Nonconfrontational</shortcomings>
        <team_strengths>Good at collaborating; treat each other with respect; help one another out</team_strengths>
      </high_score>
      <subscales>
        <subscale name="Easy to Live With" low="Not always tolerant" high="Perceived as easygoing" />
        <subscale name="Sensitive" low="Not very tactful" high="Tactful" />
        <subscale name="Caring" low="Unappreciative of others' needs" high="Perceptive and understanding" />
        <subscale name="Likes People" low="Socially withdrawn" high="Enjoys others' company" />
        <subscale name="No Hostility" low="Critical of others" high="Generally accepting" />
      </subscales>
      <subscale_guidance>Interpret mainly at the main scale level; do not overweight subscales.</subscale_guidance>
    </scale>

    <scale name="Prudence">
      <measures>Degree to which a person seems conscientious, conforming, and dependable</measures>
      <insight>Task-Focus</insight>
      <low_score>
        <behaviors>Comfortable with ambiguity; changes direction quickly; flexible about rules; does not plan ahead; bored with details</behaviors>
        <team_strengths>Works well without direction; flexible; thrives in ambiguity</team_strengths>
      </low_score>
      <high_score>
        <behaviors>Works hard; follows rules and procedures; plans in advance; has trouble delegating; tends to micromanage; absorbed with details</behaviors>
        <shortcomings>Micromanaging and change resistant</shortcomings>
        <team_strengths>Good at implementation; adheres to policy; completes assignments timely</team_strengths>
      </high_score>
      <subscales>
        <subscale name="Moralistic" low="Sets own rules" high="Follows conventional values" />
        <subscale name="Mastery" low="Relaxed about work" high="Concerned with doing a good job" />
        <subscale name="Virtuous" low="Admits minor faults" high="Principled, perfectionistic" />
        <subscale name="Not Autonomous" low="Independent, feedback resistant" high="Concerned about others' perceptions" />
        <subscale name="Not Spontaneous" low="Spontaneous" high="Planful" />
        <subscale name="Impulse Control" low="Impulsive" high="Cautious in approach" />
        <subscale name="Avoids Trouble" low="Risk-taking" high="Anticipates consequences" />
      </subscales>
      <special_patterns>
        <impression_management>
          If the first three subscales (Moralistic, Mastery, Virtuous) total 11 or more bricks,
          the participant likely has an impression management profile. They are extremely socially
          appropriate and mannerly. Consider cross-referencing with HDS Mischievous (charming
          manipulator pattern) or HDS Diligent/Dutiful + MVPI Tradition/Security (self-righteous
          rule-bound pattern).
        </impression_management>
        <delinquency_indicator>
          Very low Prudence overall, especially zero bricks on Avoids Trouble, raises the
          possibility of delinquent tendencies.
        </delinquency_indicator>
      </special_patterns>
    </scale>

    <scale name="Inquisitive">
      <measures>Degree to which a person is perceived as bright, creative, and interested in intellectual matters</measures>
      <insight>Problem-Solving</insight>
      <low_score>
        <behaviors>Pragmatic not strategic; hands-on practical problem-solver; understands implementation; rarely talks about corporate vision</behaviors>
        <team_strengths>Practical, well-established problem solving; not distracted by new tech; solves quickly based on experience</team_strengths>
      </low_score>
      <high_score>
        <behaviors>Seen as visionary; thinks quickly; understands big picture; worldly; easily bored with implementation; impractical ideas</behaviors>
        <shortcomings>Impractical and bored by implementation</shortcomings>
        <team_strengths>Good at original problem-solving; thinks strategically; pays attention to data</team_strengths>
      </high_score>
      <subscales>
        <subscale name="Science Ability" low="Little interest in why things happen" high="Strong interest in why things happen" />
        <subscale name="Curiosity" low="Low curiosity" high="High curiosity" />
        <subscale name="Thrill Seeking" low="No interest in excitement" high="Seeks challenge and excitement" />
        <subscale name="Intellectual Games" low="No interest in intellectual games" high="Interest in riddles and puzzles" />
        <subscale name="Generates Ideas" low="Not good at generating ideas" high="Good at generating new ideas" />
        <subscale name="Culture" low="Narrow interests" high="Wide cultural interests" />
      </subscales>
      <subscale_guidance>Pay special attention to Generates Ideas. If Inquisitive is average/low but Generates Ideas is high, the person can generate creative ideas but applies a strong "practicality filter" before sharing them.</subscale_guidance>
    </scale>

    <scale name="Learning Approach">
      <measures>Degree to which a person seems to enjoy academic activities and value education for its own sake</measures>
      <insight>Learning Style</insight>
      <low_score>
        <behaviors>Prefers experiential learning; more concerned with improving existing skills; overlooks training; does not read much technical material</behaviors>
        <team_strengths>Pays attention to experience as guide; grounded pragmatic approach; rarely gets lost in speculation</team_strengths>
      </low_score>
      <high_score>
        <behaviors>Values training for self and staff; stays up-to-date; self-disciplined about goals; takes action before others agree; has opinion about everything</behaviors>
        <shortcomings>Pedantic and overzealous with new ideas</shortcomings>
        <team_strengths>Forward-looking; up-to-date; identifies flawed arguments; supports sensible training</team_strengths>
      </high_score>
      <subscales>
        <subscale name="Education" low="Negative attitude about education" high="Positive attitude about education" />
        <subscale name="Math Ability" low="Weakness with numbers" high="Facility with numbers" />
        <subscale name="Good Memory" low="Somewhat forgetful" high="Good recall" />
        <subscale name="Reading" low="Knowledge may be dated" high="Knowledge is current and up-to-date" />
      </subscales>
      <subscale_guidance>High scorers inherently enjoy learning and use traditional approaches (reading, classes). Lower scorers are just-in-time learners who use experiential approaches.</subscale_guidance>
    </scale>

    <hpi_low_benefits>
      <note>Low HPI scores have genuine benefits that should always be acknowledged:</note>
      <benefit scale="Adjustment">Eager for feedback</benefit>
      <benefit scale="Ambition">Team oriented</benefit>
      <benefit scale="Sociability">Focused</benefit>
      <benefit scale="Interpersonal Sensitivity">Objective and candid</benefit>
      <benefit scale="Prudence">Flexible</benefit>
      <benefit scale="Inquisitive">Practical and willing to implement</benefit>
      <benefit scale="Learning Approach">Application oriented in learning style</benefit>
    </hpi_low_benefits>

  </hpi>

  <!-- ============================================================
       SECTION 3: HDS — THE DARK SIDE
       ============================================================ -->
  <hds>
    <interpretation_principles>
      <principle>Higher scores increase the chances that risk factors and counterproductive behaviors will emerge.</principle>
      <principle>Some high-risk scores have attractive qualities that get people noticed and promoted — until they derail.</principle>
      <principle>The ABSENCE of high risk is NOT necessarily a strength. An entirely flat low HDS profile suggests a bland individual with little influence.</principle>
      <principle>Most people have at least one or two moderate-to-high scores. This is normal.</principle>
      <principle>If someone has THREE or more high-risk scores, their behavior is likely to be more problematic.</principle>
      <principle>If no high-risk scores exist, interpret the highest elevations in the profile.</principle>
      <principle>NEVER interpret a single HDS scale in isolation. Scale scores take meaning from the context of other scales.</principle>
      <principle>Do NOT interpret HDS in isolation from HPI. Always cross-reference.</principle>
      <principle>HDS behaviors are strengths that become risks when overused.</principle>
    </interpretation_principles>

    <hds_clusters>
      <cluster name="Moving Away" theme="Intimidation">
        <description>Characterized by insecurity, mistrust, hostility, and social withdrawal. The person manages insecurity by distancing from others.</description>
        <scales>Excitable, Skeptical, Cautious, Reserved, Leisurely</scales>
        <combined_syndrome>Florid emotional swings (Excitable), alert for betrayal (Skeptical), insecure and afraid of criticism (Cautious), resentful of superiors (Leisurely), quiet and withdrawn (Reserved). Insecurity and resentment may be hard to detect beneath the prickly exterior.</combined_syndrome>
      </cluster>
      <cluster name="Moving Against" theme="Seduction">
        <description>Social self-confidence, impulsivity, energy, competitiveness, and talent for self-display. The person manages insecurity by overwhelming or manipulating others.</description>
        <scales>Bold, Mischievous, Colorful, Imaginative</scales>
        <combined_syndrome>Bright, charismatic, arrogant (Bold), excitement-seeking and limit-testing (Mischievous), self-dramatizing and impulsive (Colorful), creative to the point of eccentric (Imaginative). Common in leaders because positive aspects create a leaderlike aura.</combined_syndrome>
      </cluster>
      <cluster name="Moving Toward" theme="Control">
        <description>Conformity, obedience, and eagerness to please. The person manages insecurity by building alliances and securing approval.</description>
        <scales>Diligent, Dutiful</scales>
        <combined_syndrome>Meticulous about every detail (Diligent), looks to manager for all direction (Dutiful). Initially appreciated, but over time seen as incapable of independent action.</combined_syndrome>
      </cluster>
    </hds_clusters>

    <scale name="Excitable" cluster="Moving Away">
      <everyday_strength>Intense and energetic</everyday_strength>
      <overused>Moody, inconsistent, volatile and unpredictable</overused>
      <high_risk>Seems intense but volatile; may quit when frustrated; yells when angry; overreacts to criticism</high_risk>
      <moderate_risk>Energetic but moody; easily frustrated; irritable; becomes disappointed with projects or people</moderate_risk>
      <low_risk>Usually good mood; handles frustration without getting upset; enthusiastic; calm in emergencies</low_risk>
      <no_risk>Calm, steady, stable; expresses emotions maturely; maintains relationships</no_risk>
      <indicators>Others hold back or engage in mood management; vacillates between optimism and pessimism; explodes over minor mistakes; perceived lack of perseverance</indicators>
      <coaching>
        <keep_doing>Acting with passion, energy, and enthusiasm</keep_doing>
        <stop_doing>Losing emotional control, allowing emotions to run away, and yelling</stop_doing>
        <start_doing>Analyze frustrating situations; learn to recognize signs of losing control; leave and take time out</start_doing>
      </coaching>
      <subscales>
        <subscale name="Volatile">Moody, often angered or annoyed, easily upset and hard to soothe</subscale>
        <subscale name="Easily Disappointed">Initial passion for people/projects who inevitably disappoint; passion turns to rejection</subscale>
        <subscale name="No Direction">Lacking well-defined beliefs or interests, with regrets about past behavior</subscale>
      </subscales>
    </scale>

    <scale name="Skeptical" cluster="Moving Away">
      <everyday_strength>Perceptive and insightful</everyday_strength>
      <overused>Cynical, negative, distrustful and fault-finding</overused>
      <high_risk>Insightful about people but alert for betrayal; argumentative; easily offended; expects mistreatment; retaliates</high_risk>
      <moderate_risk>Insightful about motives and politics; takes criticism personally; holds grudges; hard to coach</moderate_risk>
      <low_risk>Listens to feedback without defensiveness; builds trust; does not hold grudges; easy to coach</low_risk>
      <no_risk>Optimistic, positive, trusting; accepts criticism; rarely argues; forgives others</no_risk>
      <coaching>
        <keep_doing>Thinking about and analyzing others' motives and challenging assumptions</keep_doing>
        <stop_doing>Arguing with others unless there is a way to reach agreement</stop_doing>
        <start_doing>Developing capacity to trust at least some people; keep doubts to yourself</start_doing>
      </coaching>
      <subscales>
        <subscale name="Cynical">Prone to doubt others' intentions; assumes bad ulterior motives</subscale>
        <subscale name="Mistrusting">Generalized mistrust of people and institutions; alert for mistreatment</subscale>
        <subscale name="Grudges">Holding grudges; unwilling to forgive real or perceived wrongs</subscale>
      </subscales>
    </scale>

    <scale name="Cautious" cluster="Moving Away">
      <everyday_strength>Careful and thorough</everyday_strength>
      <overused>Risk-averse, overly careful and fearful of failure</overused>
      <high_risk>Makes low-risk decisions; concerned about criticism; worries about staff mistakes; reluctant to try new tech; avoids controversy</high_risk>
      <no_risk>Confident, willing to speak up; tries new methods; makes decisions easily; unafraid to make mistakes</no_risk>
      <coaching>
        <keep_doing>Reviewing plans and proposals to mitigate unnecessary risk</keep_doing>
        <stop_doing>Holding up progress by avoiding decisions or resisting new technology</stop_doing>
        <start_doing>Providing solutions rather than simply raising objections</start_doing>
      </coaching>
      <subscales>
        <subscale name="Avoidant">Avoiding new people/situations to avoid imagined embarrassment</subscale>
        <subscale name="Fearful">Afraid of being criticized; reluctant to act independently</subscale>
        <subscale name="Unassertive">Unwilling to act assertively; indecisive and slow to act</subscale>
      </subscales>
    </scale>

    <scale name="Reserved" cluster="Moving Away">
      <everyday_strength>Independent and objective</everyday_strength>
      <overused>Socially withdrawn, tough, and uncommunicative</overused>
      <high_risk>Makes independent decisions; misreads social cues; seems tough; unintentionally bruises feelings</high_risk>
      <no_risk>Outgoing, friendly, kind; meets strangers well; communicates effectively; understands others' feelings</no_risk>
      <coaching>
        <keep_doing>Showing steadiness when others are emotional</keep_doing>
        <stop_doing>Tuning people out and ignoring their concerns</stop_doing>
        <start_doing>Asking people for feedback on your performance; after meetings, ask what others heard</start_doing>
      </coaching>
      <subscales>
        <subscale name="Introverted">Values private time; prefers to work alone</subscale>
        <subscale name="Unsocial">Keeps others at distance; limits close relationships; detached</subscale>
        <subscale name="Tough">Indifferent to others' feelings; task-focused; may seem cold</subscale>
      </subscales>
    </scale>

    <scale name="Leisurely" cluster="Moving Away">
      <everyday_strength>Cooperative and agreeable</everyday_strength>
      <overused>Stubborn, privately irritable and passive-resistant</overused>
      <high_risk>Good social skills but covertly feels mistreated; challenges management competence privately; irritated when interrupted; procrastinates</high_risk>
      <no_risk>Helpful, positive, responsive to criticism; solicits feedback; supports organization in private; doesn't mind interruptions</no_risk>
      <coaching>
        <keep_doing>Treating others with grace and charm</keep_doing>
        <stop_doing>Resisting feedback and requests for quicker results</stop_doing>
        <start_doing>Giving others honest feedback</start_doing>
      </coaching>
      <subscales>
        <subscale name="Passive Aggressive">Overtly pleasant but privately resentful and subversive</subscale>
        <subscale name="Unappreciated">Believes contributions are ignored; perceives workload inequities</subscale>
        <subscale name="Irritated">Privately but easily irritated by interruptions, requests, or suggestions</subscale>
      </subscales>
    </scale>

    <scale name="Bold" cluster="Moving Against">
      <everyday_strength>Confident and assertive</everyday_strength>
      <overused>Entitled, arrogant, and overestimates competence</overused>
      <high_risk>Self-confident and fearless; overestimates abilities; trouble learning from mistakes; feels entitled to leadership</high_risk>
      <no_risk>Modest, unpretentious; doesn't interrupt or challenge; avoids self-promotion; accepts responsibility for failures</no_risk>
      <coaching>
        <keep_doing>Being a role model for positive attitude toward challenges</keep_doing>
        <stop_doing>Overpromising and blaming others when plans fail</stop_doing>
        <start_doing>Sharing credit with staff for successes</start_doing>
      </coaching>
      <subscales>
        <subscale name="Entitled">Feels deserving of special treatment due to gifts and accomplishments</subscale>
        <subscale name="Overconfidence">Unusually confident; believes will succeed at anything</subscale>
        <subscale name="Fantasized Talent">Believes has unusual talents; destined for greatness; arrogant</subscale>
      </subscales>
    </scale>

    <scale name="Mischievous" cluster="Moving Against">
      <everyday_strength>Charming and interesting</everyday_strength>
      <overused>Risk-taking, limit-testing and untrustworthy</overused>
      <high_risk>Interesting, daring, fun; enjoys testing limits; needs variety; ignores mistakes; spontaneous and impulsive</high_risk>
      <no_risk>Careful, responsible, socially appropriate; learns from mistakes; follows rules; avoids unnecessary risks</no_risk>
      <coaching>
        <keep_doing>Treating clients and colleagues with respect and support</keep_doing>
        <stop_doing>Ignoring warnings and feedback about unnecessary risk-taking</stop_doing>
        <start_doing>Partnering with someone good with details and follow-up</start_doing>
      </coaching>
      <subscales>
        <subscale name="Risky">Takes risks, tests limits; deliberately bends or breaks inconvenient rules</subscale>
        <subscale name="Impulsive">Acts without considering long-term consequences</subscale>
        <subscale name="Manipulative">Uses charm to manipulate others; no remorse</subscale>
      </subscales>
    </scale>

    <scale name="Colorful" cluster="Moving Against">
      <everyday_strength>Outgoing and socially-skilled</everyday_strength>
      <overused>Attention-seeking, self-promoting and dramatic</overused>
      <high_risk>Quick-witted; often overcommits; may not listen; seeks leadership; dominates social situations</high_risk>
      <no_risk>Quiet and self-restrained; avoids calling attention to self; works behind the scenes; stays on task</no_risk>
      <coaching>
        <keep_doing>Entertaining clients, customers, and colleagues with verve</keep_doing>
        <stop_doing>Interrupting others and talking past allotted time</stop_doing>
        <start_doing>Listening rather than talking; asking if you understood correctly</start_doing>
      </coaching>
      <subscales>
        <subscale name="Public Confidence">Expects others to find performances fascinating; doesn't know when to be quiet</subscale>
        <subscale name="Distractible">Easily distracted; minimal focus; confuses activity with productivity</subscale>
        <subscale name="Self-Display">Wants center of attention; uses dramatic gestures to attract attention</subscale>
      </subscales>
    </scale>

    <scale name="Imaginative" cluster="Moving Against">
      <everyday_strength>Innovative and creative</everyday_strength>
      <overused>Eccentric, impractical, and lacking focus</overused>
      <high_risk>Playful and innovative; hard to understand; unusual ideas; surprising decisions; changes focus quickly</high_risk>
      <no_risk>Practical, steady, sensible; stays on task; makes realistic decisions; levelheaded</no_risk>
      <coaching>
        <keep_doing>Providing ideas, insights, and original solutions</keep_doing>
        <stop_doing>Offering opinions before the problem has been delineated</stop_doing>
        <start_doing>Checking with colleagues regarding practicality of ideas before going public</start_doing>
      </coaching>
      <subscales>
        <subscale name="Eccentric">Unusual views that can be creative or merely strange; absorbed in ideas</subscale>
        <subscale name="Special Sensitivity">Believes has special abilities to see things others don't</subscale>
        <subscale name="Creative Thinking">Believes unusually creative; easily bored; overconfident in problem-solving</subscale>
      </subscales>
    </scale>

    <scale name="Diligent" cluster="Moving Toward">
      <everyday_strength>Detailed and conscientious</everyday_strength>
      <overused>Micromanaging, perfectionistic, and nit-picking</overused>
      <high_risk>Polite, detail-oriented, hardworking, rulebound; tends to micromanage; tries to do everything equally well; difficult to please</high_risk>
      <no_risk>Undemanding and relaxed; doesn't micromanage; routinely delegates; flexible; prioritizes appropriately</no_risk>
      <coaching>
        <keep_doing>Working hard, being careful, being a role model for high standards</keep_doing>
        <stop_doing>Criticizing subordinates' work and requiring them to do it your way</stop_doing>
        <start_doing>Delegating tasks and letting staff make their own mistakes</start_doing>
      </coaching>
      <subscales>
        <subscale name="Standards">Exceptionally high standards for self and others</subscale>
        <subscale name="Perfectionistic">Perfectionistic about quality; obsessed with details</subscale>
        <subscale name="Organized">Meticulous and inflexible about schedules, rules, procedures</subscale>
      </subscales>
    </scale>

    <scale name="Dutiful" cluster="Moving Toward">
      <everyday_strength>Supportive and loyal</everyday_strength>
      <overused>Over-eager to please, deferential, and ingratiating</overused>
      <high_risk>Obliging, likeable; consults boss regularly; very good team player; mannerly; rarely challenges policy</high_risk>
      <no_risk>Independent and self-reliant; willing to act without approval; willing to challenge boss; sticks up for subordinates</no_risk>
      <coaching>
        <keep_doing>Keeping boss informed about relevant developments</keep_doing>
        <stop_doing>Checking with others before making decisions</stop_doing>
        <start_doing>Supporting subordinates' decisions when they are most affected</start_doing>
      </coaching>
      <subscales>
        <subscale name="Indecisive">Overly reliant on others; reluctant to make decisions independently</subscale>
        <subscale name="Ingratiating">Excessively eager to please superiors; tells them what they want to hear</subscale>
        <subscale name="Conforming">Pride in supporting superiors and following orders regardless of personal opinion</subscale>
      </subscales>
    </scale>

    <hpi_hds_relationships>
      <relationship hpi="Adjustment" hpi_direction="Low" hds="Excitable" hds_direction="High">Emotional individual who can be volatile or explosive</relationship>
      <relationship hpi="Adjustment" hpi_direction="High" hds="Bold" hds_direction="High">Self-confident individual who seems arrogant</relationship>
      <relationship hpi="Ambition" hpi_direction="Low" hds="Cautious" hds_direction="High">Follower who avoids making decisions</relationship>
      <relationship hpi="Ambition" hpi_direction="High" hds="Bold" hds_direction="High">Driven person who refuses to admit to or learn from mistakes</relationship>
      <relationship hpi="Sociability" hpi_direction="Low" hds="Reserved" hds_direction="High">Socially withdrawn with a very tough style</relationship>
      <relationship hpi="Sociability" hpi_direction="High" hds="Colorful" hds_direction="High">Gregarious person who loves personal attention</relationship>
      <relationship hpi="Interpersonal Sensitivity" hpi_direction="Low" hds="Skeptical" hds_direction="High">Argumentative person who does not trust others</relationship>
      <relationship hpi="Interpersonal Sensitivity" hpi_direction="Low" hds="Leisurely" hds_direction="High">Uses "yes" to avoid agenda conflict</relationship>
      <relationship hpi="Interpersonal Sensitivity" hpi_direction="High" hds="Dutiful" hds_direction="High">Relationship-oriented person who says "yes" to everything</relationship>
      <relationship hpi="Prudence" hpi_direction="Low" hds="Mischievous" hds_direction="High">Rule-averse person who will test the system</relationship>
      <relationship hpi="Prudence" hpi_direction="High" hds="Diligent" hds_direction="High">Rigid person who cares about every painstaking detail</relationship>
      <relationship hpi="Inquisitive" hpi_direction="Low" hds="Dutiful" hds_direction="High">Routine-oriented person who only does what told</relationship>
      <relationship hpi="Inquisitive" hpi_direction="High" hds="Imaginative" hds_direction="High">Open, creative person who lacks focus or discipline</relationship>
    </hpi_hds_relationships>

  </hds>

  <!-- ============================================================
       SECTION 4: MVPI — THE INSIDE
       ============================================================ -->
  <mvpi>
    <interpretation_principles>
      <principle>Both high and low scores provide information about values and agendas.</principle>
      <principle>Interpret scores as ranging from seeking behaviors (high) to avoiding behaviors (low).</principle>
      <principle>Interpret in light of match or mismatch with organizational context.</principle>
      <principle>Without context, focus on career compatibility and the leadership environment the person is likely to create.</principle>
      <principle>Values help understand HOW HPI and HDS scores show up in the real world.</principle>
      <principle>Pay attention to how MVPI scales cluster.</principle>
      <principle>Our core values shape what interests us and the behaviors we approve or disapprove of — often unconsciously.</principle>
    </interpretation_principles>

    <mvpi_clusters>
      <cluster name="Status Interests">Recognition, Power, Hedonism</cluster>
      <cluster name="Social Interests">Altruistic, Affiliation, Tradition</cluster>
      <cluster name="Financial Interests">Security, Commerce</cluster>
      <cluster name="Decision-Making Style">Aesthetics, Science</cluster>
    </mvpi_clusters>

    <mvpi_subscale_structure>
      Each of the 10 MVPI scales has five subscales measuring:
      1. Lifestyles — manner in which a person would like to live
      2. Beliefs — shoulds, ideals, and ultimate life goals
      3. Occupational Preferences — what makes a good job
      4. Aversions — attitudes and behaviors that are disliked or distressing
      5. Preferred Associates — kind of people desired as coworkers and friends
    </mvpi_subscale_structure>

    <scale name="Recognition" cluster="Status">
      <high_definition>Desire to be known, seen, visible, and famous; lifestyle guided by search for opportunities to be noticed</high_definition>
      <low_values>Modesty, behind-the-scenes roles, sharing credit</low_values>
      <high_values>Public acknowledgement, visibility, being center of attention</high_values>
      <leadership_implication>Wants accomplishments recognized; prefers high-profile approach; values colleagues who provide feedback</leadership_implication>
      <unconscious_bias>Will want to be center of attention, assuming others need attention as much as they do; will not understand modesty</unconscious_bias>
      <correlations>Positive with Sociability, Bold, Mischievous, Colorful, Imaginative</correlations>
    </scale>

    <scale name="Power" cluster="Status">
      <high_definition>Desire to succeed, make things happen, make a difference, outperform competition</high_definition>
      <low_values>Cooperation, democratic decision-making, following orders</low_values>
      <high_values>Authority, top-down influence, impact, challenging assignments</high_values>
      <leadership_implication>Values success; works hard strategically; enjoys authority; believes staff respond to challenges</leadership_implication>
      <unconscious_bias>Will want to win, assuming others are as competitive; will dislike people who lack a winning attitude</unconscious_bias>
      <correlations>Positive with Ambition, Sociability, Bold, Mischievous, Colorful, Imaginative</correlations>
    </scale>

    <scale name="Hedonism" cluster="Status">
      <high_definition>Pursuit of fun, excitement, pleasure; lifestyle organized around eating, drinking, entertaining</high_definition>
      <low_values>Professional formal work environments; devotion to duty; conventional and serious</low_values>
      <high_values>Fun, lighthearted, open-minded cultures; variety and excitement</high_values>
      <leadership_implication>Enjoys keeping things interesting; chooses fun-loving team members; believes people should work hard and play hard</leadership_implication>
      <unconscious_bias>Will assume others are as fun-seeking; will not understand people who are overly serious</unconscious_bias>
      <correlations>Negative with Prudence; Positive with Skeptical, Mischievous</correlations>
    </scale>

    <scale name="Altruistic" cluster="Social">
      <high_definition>Desire to help others; concern for welfare of others; lifestyle organized around public service</high_definition>
      <low_values>Personal responsibility, self-reliance, task focus, productivity over morale</low_values>
      <high_values>Helping others, coaching, providing service, staff morale, open communication</high_values>
      <leadership_implication>Cares about staff welfare; enjoys helping; colleagues expect leadership on morale issues</leadership_implication>
      <unconscious_bias>Will want to help less privileged, assuming others share this concern; will not understand need for self-reliance</unconscious_bias>
      <correlations>Positive with Interpersonal Sensitivity; Negative with Reserved; Positive with Diligent, Dutiful</correlations>
    </scale>

    <scale name="Affiliation" cluster="Social">
      <high_definition>Needing and enjoying frequent and varied social contact; lifestyle organized around social interaction</high_definition>
      <low_values>Privacy, task-focus, minimal interruptions, working alone</low_values>
      <high_values>Networking, relationships, teamwork, belonging, team-oriented work</high_values>
      <leadership_implication>Values team-based activities; creates inclusive environments; dislikes isolation</leadership_implication>
      <unconscious_bias>Will assume others want social interaction as much as they do; will not understand preference for solitude</unconscious_bias>
    </scale>

    <scale name="Tradition" cluster="Social">
      <high_definition>Belief in and dedication to conventions — family, religious affiliation, thrift, hard work, appropriate social behavior</high_definition>
      <low_values>Progress, diversity, autonomy, challenging convention</low_values>
      <high_values>Role clarity, conservative principled cultures, respect for customs</high_values>
      <leadership_implication>Expects adherence to established practices; values loyalty and respect for authority</leadership_implication>
      <unconscious_bias>Will judge others by traditional standards; may not understand or value unconventional approaches</unconscious_bias>
    </scale>

    <scale name="Security" cluster="Financial">
      <high_definition>Need for predictability and structure; efforts to avoid risk and uncertainty; lifestyle organized around minimizing errors</high_definition>
      <low_values>Risk-taking, limit-testing, experimentation, comfort with ambiguity</low_values>
      <high_values>Structure, order, predictability, job security, careful decisions</high_values>
      <leadership_implication>Creates stable, predictable environments; may resist change that threatens stability</leadership_implication>
      <unconscious_bias>Will assume others value stability as much as they do; will not understand risk-seekers</unconscious_bias>
    </scale>

    <scale name="Commerce" cluster="Financial">
      <high_definition>Interest in earning money, realizing profits, finding business opportunities; lifestyle organized around investments</high_definition>
      <low_values>Cooperation, less focus on bottom line, not motivated by money</low_values>
      <high_values>Making money, focus on bottom line, business opportunities, financial planning</high_values>
      <leadership_implication>Evaluates decisions through financial lens; rewards profit-generating behavior</leadership_implication>
      <unconscious_bias>Will assume financial incentives motivate everyone; may not understand intrinsic motivation</unconscious_bias>
    </scale>

    <scale name="Aesthetics" cluster="Decision-Making">
      <high_definition>Need for self-expression; dedication to quality; interest in how things look, feel, and sound</high_definition>
      <low_values>Functionality and substance over form; practical over beautiful</low_values>
      <high_values>Quality, image, product look and feel, creative self-expression</high_values>
      <leadership_implication>Cares about presentation quality; values creative solutions; sensitive to design and appearance</leadership_implication>
      <unconscious_bias>Will judge work by its appearance; may over-invest in aesthetics at expense of function</unconscious_bias>
    </scale>

    <scale name="Science" cluster="Decision-Making">
      <high_definition>Interest in science; comfortable with technology; prefers data-based decisions; wants to know how things work</high_definition>
      <low_values>Experience-based, intuitive decisions; practical over analytical</low_values>
      <high_values>Analytics, data-driven decision making, research, evidence-based approach</high_values>
      <leadership_implication>Demands evidence for decisions; values analytical thinking; may dismiss intuition</leadership_implication>
      <unconscious_bias>Will assume data should drive all decisions; may not value experiential or intuitive approaches</unconscious_bias>
    </scale>

  </mvpi>

  <!-- ============================================================
       SECTION 5: CONFIGURAL INTERPRETATION
       ============================================================ -->

<configural_interpretation>
<overview>
Configural interpretation looks beyond single scales to combinations of two or more scales,
within or across assessments, to gain deeper insight. This is where the real interpretive
power lies. Experience reveals that certain combinations are more common and recognizing
them dramatically improves interpretation.
</overview>

    <hpi_syndromes>
      <syndrome name="Creativity">
        <pattern>Inquisitive above 65th + Ambition above 65th + Prudence below 35th</pattern>
        <description>High Inquisitive reflects cognitive style; low Prudence reflects flexibility and willingness to challenge convention; high Ambition reflects energy to complete tasks.</description>
      </syndrome>
      <syndrome name="Arrogance">
        <pattern>Inquisitive, Adjustment, Ambition, Sociability all above 90th + Prudence above 65th</pattern>
        <description>Seems very competent and makes excellent impression. However, may see themselves as more competent than others do, promote own goals at expense of organization, ignore negative feedback, and be insensitive to subordinates. May ignore this feedback if given it.</description>
      </syndrome>
      <syndrome name="Delinquency">
        <pattern>Adjustment below 35th + Prudence below 35th + Sociability above 65th</pattern>
        <description>Alienated and unhappy (low Adjustment), hostile to rules and authority (low Prudence), but impulsive and attention-seeking (high Sociability). Relatively infrequent in normal populations; signals someone whose identity includes being tough, defiant, and scornful of normal conventions.</description>
      </syndrome>
    </hpi_syndromes>

    <character_configurations>
      <config name="The Overbearing Boss" description="Forceful, tells, doesn't seek feedback">Higher Ambition + Higher Sociability + Lower Interpersonal Sensitivity</config>
      <config name="The Showboat" description="Insecure and enjoys showing off">Lower Adjustment + Higher Sociability</config>
      <config name="The Fear-driven Salesperson" description="Highly motivated by fear of failure">Lower Adjustment + Higher Ambition + Higher Prudence</config>
      <config name="The Impression Manager" description="Political, concerned with public image">Higher Adjustment + Higher Sociability + Higher Interpersonal Sensitivity + Higher Prudence</config>
      <config name="The Good Citizen" description="Quiet, compliant, helpful, positive">Higher Adjustment + Higher Interpersonal Sensitivity + Lower Sociability + Higher Prudence</config>
      <config name="The Dreamer" description="Innovative, thinks outside the box">Lower Prudence + Higher Inquisitive + Higher Learning Approach</config>
      <config name="The Yes Person" description="Ingratiating, struggles to say no">Lower Ambition + Higher Interpersonal Sensitivity + Higher Prudence</config>
      <config name="The Maverick" description="Adventurous, quick thinker, independent">Higher Ambition + Lower Prudence + Higher Inquisitive</config>
      <config name="The Know-it-all" description="Arrogant, feedback resistant">Higher Adjustment + Higher Ambition + Higher Learning Approach</config>
    </character_configurations>

    <cross_assessment_themes>
      <theme name="Managing" description="Status seeking; conscientious about executing a business plan, mindful of details, attentive to bottom line">
        <pattern>High Ambition + Avg-high Prudence + Mod-risk Diligent + Avg-high Commerce</pattern>
      </theme>
      <theme name="Creating" description="Original; open to new ideas, thinks creatively, pays attention to style, challenges tradition">
        <pattern>Low Prudence + High Inquisitive + High-risk Imaginative + High Aesthetics</pattern>
      </theme>
      <theme name="Leading" description="Leader-like; enjoys driving results, open to new ideas, self-confident in front of people">
        <pattern>High Ambition + Avg-high Inquisitive + High-risk Bold + High Power</pattern>
      </theme>
      <theme name="Competing" description="Competitive, fearless; self-confident even in face of failure, cares about winning">
        <pattern>High Ambition + High-risk Bold + High Power</pattern>
      </theme>
      <theme name="Resisting" description="Rigid, inflexible; fussy about details, avoids decisions, worries about change, hostile to innovation">
        <pattern>High Prudence + Low Inquisitive + High-risk Cautious + High-risk Diligent + High Security</pattern>
      </theme>
      <theme name="Risk-Taking" description="Calm; enjoys testing limits, views rules as obstacles, seeks environments where risk-taking is rewarded">
        <pattern>Low Prudence + High-risk Mischievous + Low Security</pattern>
      </theme>
      <theme name="Ingratiating" description="Gregarious; avoids conflict, follows others' lead, seeks management approval">
        <pattern>High Sociability + High Interpersonal Sensitivity + High-risk Dutiful + High Affiliation</pattern>
      </theme>
      <theme name="Intimidating" description="Aggressive, tough; insensitive, blunt, uncommunicative, prefers to work alone">
        <pattern>Low Sociability + Low Interpersonal Sensitivity + High-risk Reserved + Low Affiliation</pattern>
      </theme>
    </cross_assessment_themes>

    <hds_conflict_patterns>
      <conflict scales="Excitable + Leisurely">Both elevated: Shows stress reactions without restraint (Excitable) but keeps opinions about people private (Leisurely). Others see stress signs but don't know why.</conflict>
      <conflict scales="Cautious + Mischievous">Both elevated: Great restraint in novel situations (Cautious) but reckless abandon when comfortable (Mischievous). Creates frustrating hurry-up/wait dichotomy.</conflict>
      <conflict scales="Cautious + Dutiful">Both elevated: Strong desire to slow down (Cautious) conflicts with sense of duty and loyalty (Dutiful). Internal conflict when directed into uncertain projects.</conflict>
      <conflict scales="Reserved + Bold">Both elevated: Extreme aloofness (Reserved) combined with arrogance (Bold). Unwilling to admit faults. Moves Away from subordinates while Moving Against superiors.</conflict>
      <conflict scales="Reserved + Colorful">Both elevated: Withdraws and acts in painfully objective manner (Reserved) but also demonstrates attention-seeking behavior (Colorful). Others are baffled about which will appear.</conflict>
      <conflict scales="Leisurely + Diligent">Both elevated: Stubbornly resists following others' processes (Leisurely) while strongly promoting own rigid way (Diligent). Reputation for inflexibility and inability to be a team player.</conflict>
      <conflict scales="Leisurely + Dutiful">Both elevated: Both involve unwillingness to confront. Leisurely agrees to terms but won't follow through. Dutiful won't publicly disagree with boss. Person loses organizational voice.</conflict>
      <conflict scales="Mischievous + Diligent">Both elevated: Both have unwillingness to follow others' rules at core. Shuns others' distasteful ideas (Mischievous) while forcing own way on others (Diligent). Very opinionated.</conflict>
    </hds_conflict_patterns>

    <hpi_conflict_patterns>
      <conflict scales="Low Adjustment + High Ambition">Sets high expectations but focuses on negative, exception-driven leadership due to emotional volatility.</conflict>
      <conflict scales="High Ambition + Low Sociability">High expectations and goals not proactively communicated to others.</conflict>
      <conflict scales="High Ambition + High Interpersonal Sensitivity">Wants to be both the leader AND the friend to subordinates. Feels conflicted about confronting poor performance.</conflict>
      <conflict scales="High Sociability + Low Interpersonal Sensitivity">Good at starting relationships but has trouble maintaining them due to blunt style.</conflict>
      <conflict scales="Low Sociability + High Interpersonal Sensitivity">Not wanting to be around people who want to be around you — perceived as aloof.</conflict>
      <conflict scales="High Prudence + High Inquisitive">Open to new ideas but too inflexible and detail-oriented to get anything implemented.</conflict>
    </hpi_conflict_patterns>

    <mvpi_conflict_patterns>
      <conflict scales="High Recognition + Low Affiliation">Wants to be noticed but not motivated to network or share accomplishments.</conflict>
      <conflict scales="High Altruistic + High Power">Putting self-interests aside (Altruistic) counterproductive to drive and goal orientation (Power).</conflict>
      <conflict scales="High Commerce + High Security">Making money requires risk (Commerce) which conflicts with preference for low-risk (Security).</conflict>
      <conflict scales="High Aesthetics + High Science">Quality defined subjectively by look and feel (Aesthetics) vs. objectively by data (Science).</conflict>
      <conflict scales="High Affiliation + High Power">Social team orientation (Affiliation) can conflict with desire to compete and dominate (Power).</conflict>
    </mvpi_conflict_patterns>

</configural_interpretation>

  <!-- ============================================================
       SECTION 6: FEEDBACK DELIVERY GUIDANCE
       ============================================================ -->

<feedback_delivery>
<preparation>
<step>Review all reports before the session</step>
<step>Prepare hypotheses about scale connections but let the recipient help connect dots</step>
<step>Have the Flash Report handy during context interview to make notes next to related scales</step>
<step>Focus on the most salient scales, not every single one</step>
</preparation>

    <session_structure>
      <phase name="Frame Setting">
        Review logistics (duration, number of sessions, timing).
        Cover confidentiality and data privacy practices.
        Explain purpose and goals, including any post-session expectations.
      </phase>
      <phase name="Context Interview">
        Gather educational and professional background, career history, current role, future goals.
        Understand organizational context, manager, team structure.
        Identify current challenges, problems, roadblocks.
        Determine key competencies for current role and development aims.
      </phase>
      <phase name="Orientation">
        Introduce Hogan as measuring reputation (how others see the person), which may differ from identity.
        Explain percentile scoring compared to working adults.
        Emphasize that high scores are not always better — especially on HDS.
        Note that apparent conflicts between scales are normal and often the deepest source of insight.
      </phase>
      <phase name="Debrief Results">
        Follow the rules in the language_rules section below.
        Link results to the person's specific context throughout.
        Describe relationships between scales thematically.
        Integrate across all three assessments.
      </phase>
      <phase name="Wrap Up">
        Summarize key points (start, stop, continue).
        Provide suggestions for increasing effectiveness.
        Help set concrete goals and development targets.
      </phase>
    </session_structure>

    <language_rules>
      <do_this>Use probabilistic language: "People scoring in this range tend to be described by others as..."</do_this>
      <do_this>Present implications in a balanced, non-judgmental manner</do_this>
      <do_this>Ask open-ended questions: "What feedback have you received about this?"</do_this>
      <do_this>Tailor to the participant's context</do_this>
      <do_this>Come prepared with hypotheses but invite the recipient to connect dots</do_this>
      <do_this>Describe scale relationships and thematic linkages within and across assessments</do_this>
      <avoid>Overly definitive language implying conclusive interpretations</avoid>
      <avoid>Reading the reports verbatim to the participant</avoid>
      <avoid>Coming on too strong or too soft when describing implications</avoid>
      <avoid>Closed-ended questions that elicit one-word answers</avoid>
      <avoid>Making assumptions based on Hogan results alone</avoid>
      <avoid>Over- or under-reacting to push-back or feedback resistance</avoid>
      <avoid>Defining every single scale in depth — focus on the most salient ones</avoid>
    </language_rules>

    <handling_resistance>
      Feedback resistance is common and often reflects a gap between identity and reputation.
      Consider re-framing the result, giving an example, exploring subscale implications,
      or asking the person what might explain the pattern. Never dismiss resistance but also
      do not withhold important developmental insights.
    </handling_resistance>

</feedback_delivery>

  <!-- ============================================================
       SECTION 7: JOB FAMILY PROFILES
       ============================================================ -->

<job_family_profiles>
<job_family name="Managers and Executives">
<description>Positions of administrative or managerial authority over human, physical, and/or financial resources</description>
<hpi_profile>
<ideal scale="Adjustment" range="Average to High" />
<ideal scale="Ambition" range="Average to High" />
<ideal scale="Interpersonal Sensitivity" range="Average to High" />
<ideal scale="Prudence" range="Average" />
</hpi_profile>
<hds_profile>
<ideal scale="Skeptical" range="Low Risk" note="Healthy skepticism" />
<ideal scale="Bold" range="Low to Moderate Risk" note="Confident and in charge" />
<ideal scale="Mischievous" range="Low to Moderate Risk" note="Willing to test limits without crossing the line" />
<ideal scale="Colorful" range="Low to Moderate Risk" note="Engaging and attractive" />
<ideal scale="Imaginative" range="Low to Moderate Risk" note="Creative and somewhat unconventional" />
<ideal scale="Diligent" range="Low Risk" note="Attends to details when needed" />
</hds_profile>
<mvpi_profile>
<ideal scale="Power" range="Average to High" />
</mvpi_profile>
</job_family>
<note>Additional job families (Professionals, Technicians, Operations, Sales, Administrative, Service) follow similar patterns — consult the Hogan Guide for details specific to each family.</note>
</job_family_profiles>

  <!-- ============================================================
       SECTION 8: INTEGRATION FRAMEWORK
       ============================================================ -->

<integration_framework>
<step_1 name="Identify HPI Themes">
<theme name="Energy and Drive">Driven by Adjustment and Ambition. How does the person handle stress and what is their competitive drive?</theme>
<theme name="Relationship and Communication Style">Driven by Sociability and Interpersonal Sensitivity. How does the person interact and communicate?</theme>
<theme name="Problem-Solving and Learning Style">Driven by Prudence, Inquisitive, and Learning Approach. How does the person approach tasks, problems, and development?</theme>
</step_1>
<step_2 name="Connect HDS to HPI Themes">
For each HPI theme, identify which HDS elevations connect and explain how dark-side risks relate to the bright-side patterns.
</step_2>
<step_3 name="Connect MVPI to HPI Themes">
For each HPI theme, identify which MVPI scores explain the underlying motivations and values driving the behavioral pattern.
</step_3>
<step_4 name="Synthesize Key Takeaways">
Develop 3-5 actionable takeaways that integrate findings across all three assessments, framed as concrete development suggestions.
</step_4>
<leadership_personality_summary>
Structure the final summary as:
VALUES: The environment you will strive to create (from MVPI highs)
STRENGTHS: Characteristics you possess to create it (from HPI patterns)
RISKS: Performance risks that could get in the way (from HDS elevations)
</leadership_personality_summary>
</integration_framework>

</hogan_interpretation_guide>
