{
"hogan_assessment_framework": {
"version": "1.0",
"description": "Complete index of all scored dimensions across the three Hogan Assessment instruments",
"total_primary_scales": 28,
"total_subscales": 124,

    "assessments": {
      "HPI": {
        "full_name": "Hogan Personality Inventory",
        "label": "The Bright Side",
        "measures": "Everyday personality — strengths and challenges visible in day-to-day behavior",
        "basis": "Five-Factor Model (FFM)",
        "published": 1986,
        "completion_time_minutes": "15-20",
        "score_format": "Percentile",
        "scoring_bands": {
          "three_level": {
            "Low": { "min": 0, "max": 35 },
            "Average": { "min": 36, "max": 64 },
            "High": { "min": 65, "max": 100 }
          },
          "four_level": {
            "Low": { "min": 0, "max": 25 },
            "Below Average": { "min": 26, "max": 50 },
            "Above Average": { "min": 51, "max": 75 },
            "High": { "min": 76, "max": 100 }
          }
        },
        "special_scales": {
          "Validity": {
            "type": "pass_fail",
            "pass": "Four bars — regular, consistent, typical, careful responding",
            "fail": "Zero bars — irregular, inconsistent, atypical, or inattentive responding",
            "note": "Invalid does NOT equal uninterpretable"
          }
        },
        "ffm_mapping": {
          "Emotional Stability": ["Adjustment"],
          "Extraversion": ["Ambition", "Sociability"],
          "Agreeableness": ["Interpersonal Sensitivity"],
          "Dependability": ["Prudence"],
          "Openness to Experience": ["Inquisitive", "Learning Approach"]
        },
        "primary_scale_count": 7,
        "total_subscale_count": 41,
        "scales": {
          "Adjustment": {
            "insight_regarding": "Resilience",
            "ffm_factor": "Emotional Stability",
            "low_score_behaviors": "Vigilant, self-aware, high sense of urgency; pessimistic, tense, stress-prone",
            "high_score_behaviors": "Resilient, optimistic, composed; arrogant & feedback-resistant",
            "low_benefit": "Eager for feedback",
            "high_shortcoming": "Feedback resistant and arrogant",
            "subscales": [
              {
                "name": "Empathy",
                "low_score": "Irritated by others' flaws",
                "high_score": "Empathic toward others' shortcomings",
                "sample_item": "I believe people should have a second chance.",
                "churn_type": "internal"
              },
              {
                "name": "Not Anxious",
                "low_score": "Anxious or tense",
                "high_score": "Seems relaxed & seldom gets anxious",
                "sample_item": "Deadlines don't bother me.",
                "churn_type": "internal"
              },
              {
                "name": "No Guilt",
                "low_score": "Worries about & regrets past mistakes",
                "high_score": "Does not dwell on or regret past mistakes",
                "sample_item": "I have few regrets about the past.",
                "churn_type": "internal"
              },
              {
                "name": "Calmness",
                "low_score": "Gets emotional at times",
                "high_score": "Is calm & collected",
                "sample_item": "My coworkers think I am a calm person.",
                "churn_type": "internal"
              },
              {
                "name": "Even Tempered",
                "low_score": "Is temperamental or moody",
                "high_score": "Is even-tempered with stable moods",
                "sample_item": "I am a patient person.",
                "churn_type": "external"
              },
              {
                "name": "No Complaints",
                "low_score": "Complains about many issues",
                "high_score": "Does not often complain",
                "sample_item": "I'm not one to complain.",
                "churn_type": "external"
              },
              {
                "name": "Trusting",
                "low_score": "Questions others' intentions",
                "high_score": "Trusts others & not suspicious of intent",
                "sample_item": "Most people are basically honest.",
                "churn_type": "external"
              },
              {
                "name": "Good Attachment",
                "low_score": "Hostile towards authority",
                "high_score": "Has positive attitude toward authority",
                "sample_item": "In school, teachers liked me.",
                "churn_type": "external"
              }
            ]
          },
          "Ambition": {
            "insight_regarding": "Drive & Energy",
            "ffm_factor": "Extraversion",
            "low_score_behaviors": "Supportive, team player; lower confidence, drive, & initiative",
            "high_score_behaviors": "High self-confidence, drive, energy; forceful, may over-compete or intimidate",
            "low_benefit": "Team oriented",
            "high_shortcoming": "Intimidating to and competitive with others",
            "subscales": [
              {
                "name": "Competitive",
                "low_score": "Laid back & lacks competitive drive",
                "high_score": "Enjoys competition & works to get ahead",
                "sample_item": "I always play to win."
              },
              {
                "name": "Self Confident",
                "low_score": "Lacks confidence",
                "high_score": "Confident in oneself & abilities",
                "sample_item": "I expect to succeed at everything."
              },
              {
                "name": "Accomplishment",
                "low_score": "Unhappy with accomplishments",
                "high_score": "Enjoys & is satisfied with achievements",
                "sample_item": "When I fail at something, I try even harder the next time."
              },
              {
                "name": "Leadership",
                "low_score": "Reluctant to assume leadership roles",
                "high_score": "Willing to assume authority positions",
                "sample_item": "I think I would enjoy positions of authority."
              },
              {
                "name": "Identity",
                "low_score": "Lacks career direction",
                "high_score": "Focused career direction",
                "sample_item": "I am confident in my career choice."
              },
              {
                "name": "No Social Anxiety",
                "low_score": "Socially retiring & lacks social confidence",
                "high_score": "Socially confident & sure of self",
                "sample_item": "I am pretty confident about my ability as a public speaker."
              }
            ]
          },
          "Sociability": {
            "insight_regarding": "Social Style",
            "ffm_factor": "Extraversion",
            "low_score_behaviors": "Focused, purposeful, task-oriented; socially reactive, lower-impact social style",
            "high_score_behaviors": "Socially proactive, team-oriented; distractible, may talk more than listen",
            "low_benefit": "Focused",
            "high_shortcoming": "Flighty and distractible",
            "subscale_guidance": "First three = frequency of social situations; last two = social engagement behaviors. Interpret mainly at main scale level.",
            "subscales": [
              {
                "name": "Likes Parties",
                "low_score": "Does not enjoy social gatherings",
                "high_score": "Enjoys social gatherings",
                "sample_item": "I often go to parties in my free time.",
                "subscale_type": "social_frequency"
              },
              {
                "name": "Likes Crowds",
                "low_score": "Prefers smaller group settings",
                "high_score": "Enjoys large group settings",
                "sample_item": "I enjoy crowded sporting events.",
                "subscale_type": "social_frequency"
              },
              {
                "name": "Experience Seeking",
                "low_score": "Unadventurous & prefers little variety",
                "high_score": "Adventurous; seeks new experiences",
                "sample_item": "I like a lot of variety in my life.",
                "subscale_type": "social_frequency"
              },
              {
                "name": "Exhibitionistic",
                "low_score": "Avoids the limelight",
                "high_score": "Wants attention; enjoys the limelight",
                "sample_item": "I sometimes show off in front of others.",
                "subscale_type": "social_engagement"
              },
              {
                "name": "Entertaining",
                "low_score": "Not particularly entertaining",
                "high_score": "Charming, amusing, good sense of humor",
                "sample_item": "I always have a good joke to tell.",
                "subscale_type": "social_engagement"
              }
            ]
          },
          "Interpersonal Sensitivity": {
            "insight_regarding": "Communication Style",
            "ffm_factor": "Agreeableness",
            "low_score_behaviors": "Direct, candid, straightforward; potentially abrasive & argumentative",
            "high_score_behaviors": "Diplomatic, warm, friendly, kind; conflict avoidant & overly sensitive",
            "low_benefit": "Objective and candid",
            "high_shortcoming": "Nonconfrontational",
            "subscale_guidance": "Interpret mainly at main scale level; do not overweight subscales.",
            "subscales": [
              {
                "name": "Easy to Live With",
                "low_score": "Not always tolerant & kind-hearted",
                "high_score": "Perceived as tolerant & easygoing",
                "sample_item": "I can get along with just about anybody."
              },
              {
                "name": "Sensitive",
                "low_score": "Not very tactful, seems insensitive",
                "high_score": "Tactful, kind & considerate",
                "sample_item": "I am sensitive to others' feelings."
              },
              {
                "name": "Caring",
                "low_score": "Does not appreciate others' needs",
                "high_score": "Perceptive, sensitive & understanding",
                "sample_item": "I like helping people who need a break."
              },
              {
                "name": "Likes People",
                "low_score": "Socially withdrawn & isolating",
                "high_score": "Enjoys interaction & others' company",
                "sample_item": "I am actively involved in my community."
              },
              {
                "name": "No Hostility",
                "low_score": "Critical of other faults & mistakes",
                "high_score": "Generally accepting of others' faults",
                "sample_item": "I would rather not criticize people, even when they need it."
              }
            ]
          },
          "Prudence": {
            "insight_regarding": "Task-Focus",
            "ffm_factor": "Dependability",
            "low_score_behaviors": "Flexible, ambiguity-tolerant; disorganized & resistant to supervision",
            "high_score_behaviors": "Compliant, process-focused, organized; rigid & inflexible about details & rules",
            "low_benefit": "Flexible",
            "high_shortcoming": "Micromanaging and change resistant",
            "special_indicators": {
              "impression_management": "If Moralistic + Mastery + Virtuous total ≥ 11 bricks, likely impression management profile",
              "delinquency": "Very low Prudence overall, especially 0 bricks on Avoids Trouble, raises possibility of delinquent tendencies"
            },
            "subscales": [
              {
                "name": "Moralistic",
                "low_score": "Prefers to set his/her own rules",
                "high_score": "Adheres strictly to conventional values",
                "sample_item": "I always admit it when I make a mistake.",
                "impression_management_subscale": true
              },
              {
                "name": "Mastery",
                "low_score": "Relaxed attitude about his/her work",
                "high_score": "Hard-working & wants to do a good job",
                "sample_item": "I strive for perfection in everything I do.",
                "impression_management_subscale": true
              },
              {
                "name": "Virtuous",
                "low_score": "Willing to admit minor faults",
                "high_score": "Diligent, precise, & perfectionistic",
                "sample_item": "It bothers me when people don't proofread their work.",
                "impression_management_subscale": true
              },
              {
                "name": "Not Autonomous",
                "low_score": "Independent & feedback resistant",
                "high_score": "Concerned about others' opinions",
                "sample_item": "I never speak in a group where I have a differing opinion."
              },
              {
                "name": "Not Spontaneous",
                "low_score": "Spontaneous; enjoys improvisation",
                "high_score": "Planful approach; enjoys predictability",
                "sample_item": "Each morning, I know what I want to accomplish that day."
              },
              {
                "name": "Impulse Control",
                "low_score": "Enjoys being impulsive",
                "high_score": "Deliberate, prefers to 'play it safe'",
                "sample_item": "I would never buy the first car that I test drive."
              },
              {
                "name": "Avoids Trouble",
                "low_score": "Takes risks; professed troublemaker",
                "high_score": "Considers actions & their consequences",
                "sample_item": "I avoid trouble at all costs."
              }
            ]
          },
          "Inquisitive": {
            "insight_regarding": "Problem-Solving",
            "ffm_factor": "Openness to Experience",
            "low_score_behaviors": "Pragmatic, strong implementer; tactical, short-term focus",
            "high_score_behaviors": "Curious, long-term focus, big-picture view; low process & execution focus, easily bored",
            "low_benefit": "Practical and willing to implement",
            "high_shortcoming": "Impractical and bored by implementation",
            "subscale_guidance": "Pay special attention to Generates Ideas. If Inquisitive is average/low but Generates Ideas is high, person has creative ideas but applies a strong 'practicality filter'.",
            "subscales": [
              {
                "name": "Science Ability",
                "low_score": "Shows little interest in why things happen",
                "high_score": "Takes an interest in why things happen",
                "sample_item": "Science is the key to our future."
              },
              {
                "name": "Curiosity",
                "low_score": "Low degree of curiosity about the world",
                "high_score": "High degree of curiosity about the world",
                "sample_item": "I ask other people a lot of questions."
              },
              {
                "name": "Thrill Seeking",
                "low_score": "Not interested in stimulation/excitement",
                "high_score": "Seeks challenge, stimulation, excitement",
                "sample_item": "My friends think I am an adventurous person."
              },
              {
                "name": "Intellectual Games",
                "low_score": "Not interested in intellectual games",
                "high_score": "Interested in riddles & puzzles",
                "sample_item": "I enjoy solving riddles."
              },
              {
                "name": "Generates Ideas",
                "low_score": "Does not see self as an idea generator",
                "high_score": "Good at generating new ideas",
                "sample_item": "I enjoy brainstorming."
              },
              {
                "name": "Culture",
                "low_score": "Narrow interests, reluctant to try new things",
                "high_score": "Wide variety of activities & interests",
                "sample_item": "I enjoy visiting historical landmarks."
              }
            ]
          },
          "Learning Approach": {
            "insight_regarding": "Learning Style",
            "ffm_factor": "Openness to Experience",
            "low_score_behaviors": "Hands-on, practical learning style; may seem uninformed or not stay up-to-date",
            "high_score_behaviors": "Continuous, traditional learning style; may over-analyze or seem overly academic",
            "low_benefit": "Application oriented in learning style",
            "high_shortcoming": "Pedantic and overzealous with new ideas",
            "subscales": [
              {
                "name": "Education",
                "low_score": "Negative experiences with education",
                "high_score": "Positive attitude about education",
                "sample_item": "Doing well in school was important to me."
              },
              {
                "name": "Math Ability",
                "low_score": "Does not work well with numbers",
                "high_score": "Works well with numbers",
                "sample_item": "Others usually depend on me to calculate the tip when dining out."
              },
              {
                "name": "Good Memory",
                "low_score": "Somewhat forgetful",
                "high_score": "Can remember things easily",
                "sample_item": "I have a good memory."
              },
              {
                "name": "Reading",
                "low_score": "Does not keep up-to-date",
                "high_score": "Keeps up-to-date; enjoys reading",
                "sample_item": "I am always reading."
              }
            ]
          }
        }
      },

      "HDS": {
        "full_name": "Hogan Development Survey",
        "label": "The Dark Side",
        "measures": "Performance risks that emerge under stress, boredom, complacency, fatigue, or when not actively self-monitoring",
        "published": 1997,
        "completion_time_minutes": "15-20",
        "score_format": "Percentile",
        "scoring_bands": {
          "No Risk": { "min": 0, "max": 39 },
          "Low Risk": { "min": 40, "max": 69 },
          "Moderate Risk": { "min": 70, "max": 89 },
          "High Risk": { "min": 90, "max": 100 }
        },
        "key_principles": [
          "Higher scores = greater likelihood risk behaviors emerge",
          "Some high-risk scores have initially attractive qualities",
          "Absence of high risk is NOT necessarily a strength",
          "Most people have 1-2 moderate/high scores (normal)",
          "3+ high-risk scores = more problematic pattern",
          "If no high-risk scores, interpret highest elevations"
        ],
        "primary_scale_count": 11,
        "total_subscale_count": 33,
        "clusters": {
          "Moving Away": {
            "theme": "Intimidation / Flight",
            "description": "Managing insecurity by distancing from others",
            "scales": ["Excitable", "Skeptical", "Cautious", "Reserved", "Leisurely"]
          },
          "Moving Against": {
            "theme": "Seduction / Fight",
            "description": "Managing insecurity by overwhelming or manipulating others",
            "scales": ["Bold", "Mischievous", "Colorful", "Imaginative"]
          },
          "Moving Toward": {
            "theme": "Control / Need to Be Right",
            "description": "Managing insecurity by building alliances and securing approval",
            "scales": ["Diligent", "Dutiful"]
          }
        },
        "scales": {
          "Excitable": {
            "cluster": "Moving Away",
            "everyday_strength": "Intense & energetic",
            "overused_risk": "Moody, inconsistent, volatile & unpredictable",
            "hpi_relationship": { "scale": "Adjustment", "direction": "inversely related" },
            "subscales": [
              {
                "name": "Volatile",
                "low_score": "Self-controlled; strong emotional regulation but may seem overly restrained",
                "high_score": "Temperamental, easily angered or upset, tendency to lose control & overreact",
                "sample_item": "I frequently argue with my family and friends."
              },
              {
                "name": "Easily Disappointed",
                "low_score": "Tolerant & resilient, but may seem to lack passion",
                "high_score": "Shows initial passion for people & projects, but is easily disappointed & loses interest",
                "sample_item": "Sometimes at work I get pretty discouraged."
              },
              {
                "name": "No Direction",
                "low_score": "Steady, self-assured, clear about beliefs; unlikely to dwell on mistakes",
                "high_score": "May lack energy & well-defined beliefs or interests; regrets past behavior",
                "sample_item": "Sometimes I am not sure what I really believe."
              }
            ]
          },
          "Skeptical": {
            "cluster": "Moving Away",
            "everyday_strength": "Perceptive & insightful",
            "overused_risk": "Cynical, negative, distrustful & fault-finding",
            "hpi_relationship": { "scale": "Interpersonal Sensitivity", "direction": "inversely related" },
            "subscales": [
              {
                "name": "Cynical",
                "low_score": "Seems positive & steady, but may not examine others' true intentions; naïve",
                "high_score": "Perceptive about others' intentions; assumes ulterior motives; quarrelsome",
                "sample_item": "Most people make friends because they want something from them."
              },
              {
                "name": "Mistrusting",
                "low_score": "Generally trusting & cooperative; may be taken advantage of",
                "high_score": "Generalized mistrust of people & institutions; alert for mistreatment",
                "sample_item": "You can't trust anyone but yourself."
              },
              {
                "name": "Grudges",
                "low_score": "Forgiving & understanding; others may take advantage of this",
                "high_score": "Unforgiving and prone to holding grudges; unsympathetic & fault-finding",
                "sample_item": "Some people have treated me in ways that I can never forget."
              }
            ]
          },
          "Cautious": {
            "cluster": "Moving Away",
            "everyday_strength": "Careful & thorough",
            "overused_risk": "Risk-averse, overly careful & fearful of failure",
            "hpi_relationship": { "scale": "Ambition", "direction": "inversely related" },
            "subscales": [
              {
                "name": "Avoidant",
                "low_score": "Open, enthusiastic & eager; may overpower others",
                "high_score": "Avoids new people & situations to avert potential embarrassment",
                "sample_item": "I feel awkward around strangers."
              },
              {
                "name": "Fearful",
                "low_score": "Willing to try new things; may be forceful expressing opinions",
                "high_score": "Timid; afraid of criticism; reluctant to act independently",
                "sample_item": "I worry about what the future might bring."
              },
              {
                "name": "Unassertive",
                "low_score": "Decisive & assertive; may seem abrasive or abrupt",
                "high_score": "Unwilling to act assertively; indecisive & slow to act",
                "sample_item": "I sometimes don't stick up for myself at work."
              }
            ]
          },
          "Reserved": {
            "cluster": "Moving Away",
            "everyday_strength": "Independent & objective",
            "overused_risk": "Socially withdrawn, tough, & uncommunicative",
            "hpi_relationship": { "scale": "Sociability", "direction": "inversely related" },
            "subscales": [
              {
                "name": "Introverted",
                "low_score": "Socially engaging & enthusiastic; may be socially boisterous",
                "high_score": "Values private time & prefers to work alone; withdrawn or lacking energy",
                "sample_item": "I enjoy my private time at work."
              },
              {
                "name": "Unsocial",
                "low_score": "Relationship-oriented, accessible, warm; may seem conflict-avoidant",
                "high_score": "Keeps others at distance; limits close relationships; detached & aloof",
                "sample_item": "I rarely attend work parties."
              },
              {
                "name": "Tough",
                "low_score": "Sympathetic, sensitive to feelings; may seem overly diplomatic",
                "high_score": "Indifferent to others' feelings & problems; task-focused; may seem cold",
                "sample_item": "Other people's problems don't concern me."
              }
            ]
          },
          "Leisurely": {
            "cluster": "Moving Away",
            "everyday_strength": "Cooperative & agreeable",
            "overused_risk": "Stubborn, privately irritable & passive-resistant",
            "hpi_relationship": { "scale": "Interpersonal Sensitivity", "direction": "complex" },
            "subscales": [
              {
                "name": "Passive Aggressive",
                "low_score": "Steady, cooperative & forgiving; comfortable expressing opinions",
                "high_score": "Overtly cooperative but privately resentful, subversive & agenda-driven",
                "sample_item": "It doesn't hurt others at work to wait for me."
              },
              {
                "name": "Unappreciated",
                "low_score": "Cooperative, efficient & willing to help; believes hard work speaks for itself",
                "high_score": "Believes contributions are ignored; perceives inequities in workloads",
                "sample_item": "People don't seem to recognize how hard I work."
              },
              {
                "name": "Irritated",
                "low_score": "Open to feedback, cooperative; willingness to help may distract from own agenda",
                "high_score": "Privately but easily irritated by interruptions, requests, or feedback",
                "sample_item": "When others annoy me at work, I try not to let them know."
              }
            ]
          },
          "Bold": {
            "cluster": "Moving Against",
            "everyday_strength": "Confident & assertive",
            "overused_risk": "Entitled, arrogant, & overestimates competence",
            "hpi_relationship": { "scale": "Ambition", "direction": "positively related" },
            "subscales": [
              {
                "name": "Entitled",
                "low_score": "Unassuming, unpretentious & helpful; may lack confidence",
                "high_score": "Feels deserving of special treatment; combative & expectant of deference",
                "sample_item": "I insist that others treat me with the proper respect."
              },
              {
                "name": "Overconfidence",
                "low_score": "Modest & realistic about abilities; may lack focus & drive",
                "high_score": "Unusually confident; organized & systematic, but overestimates abilities",
                "sample_item": "I do many things better than almost everyone I know."
              },
              {
                "name": "Fantasized Talent",
                "low_score": "Practical, content & realistic; may prefer routine work",
                "high_score": "Believes has unusual talents and is capable of greatness; arrogant",
                "sample_item": "I am destined for greatness."
              }
            ]
          },
          "Mischievous": {
            "cluster": "Moving Against",
            "everyday_strength": "Charming & interesting",
            "overused_risk": "Risk-taking, limit-testing & untrustworthy",
            "hpi_relationship": { "scale": "Prudence", "direction": "inversely related" },
            "subscales": [
              {
                "name": "Risky",
                "low_score": "Compliant, conservative & unadventurous; avoids unnecessary risk",
                "high_score": "Takes risks & tests limits; deliberately bends or breaks inconvenient rules",
                "sample_item": "I have a reputation as a risk taker."
              },
              {
                "name": "Impulsive",
                "low_score": "Dependable, reliable & focused; may seem overly structured",
                "high_score": "Acts without considering consequences; disorganized & unpredictable",
                "sample_item": "At work I often act on impulse."
              },
              {
                "name": "Manipulative",
                "low_score": "Genuine, straightforward, trustworthy; may struggle to influence others",
                "high_score": "Uses charm to manipulate others & is not remorseful",
                "sample_item": "When I want to get my way, I know how to 'turn on the charm.'"
              }
            ]
          },
          "Colorful": {
            "cluster": "Moving Against",
            "everyday_strength": "Outgoing & socially-skilled",
            "overused_risk": "Attention-seeking, self-promoting & dramatic",
            "hpi_relationship": { "scale": "Sociability", "direction": "positively related" },
            "subscales": [
              {
                "name": "Public Confidence",
                "low_score": "Self-restrained, quiet & controlled; may seem socially inhibited",
                "high_score": "Socially confident; engaging but attention-seeking, dominates conversation",
                "sample_item": "I enjoy performing in front of an audience."
              },
              {
                "name": "Distractible",
                "low_score": "Focused, task-oriented & methodical; may be unable to shift gears quickly",
                "high_score": "Energetic & idea-oriented; easily bored, distractible, needs constant stimulation",
                "sample_item": "I get bored quickly."
              },
              {
                "name": "Self-Display",
                "low_score": "Restrained, adherent to group norms; may not make a strong impression",
                "high_score": "Expressive, entertaining & dramatic; enjoys spotlight; attention-seeking",
                "sample_item": "I must admit that I like to show off."
              }
            ]
          },
          "Imaginative": {
            "cluster": "Moving Against",
            "everyday_strength": "Innovative & creative",
            "overused_risk": "Eccentric, impractical, & lacking focus",
            "hpi_relationship": { "scale": "Inquisitive", "direction": "positively related" },
            "subscales": [
              {
                "name": "Eccentric",
                "low_score": "Conventional, practical & organized; may seem unoriginal",
                "high_score": "Curious & imaginative but disorganized & unfocused; views may be odd",
                "sample_item": "People think I am something of a character."
              },
              {
                "name": "Special Sensitivity",
                "low_score": "Open to others' ideas; may not be perceived as having strong vision",
                "high_score": "Belief that one can see things others don't & understand complex issues",
                "sample_item": "I often sense things before others do."
              },
              {
                "name": "Creative Thinking",
                "low_score": "Pragmatic & grounded; may seem uninspired or lacking curiosity",
                "high_score": "Highly creative & idea-oriented but easily bored & overconfident in problem-solving",
                "sample_item": "Many of my ideas are ahead of their time."
              }
            ]
          },
          "Diligent": {
            "cluster": "Moving Toward",
            "everyday_strength": "Detailed & conscientious",
            "overused_risk": "Micromanaging, perfectionistic, & nit-picking",
            "hpi_relationship": { "scale": "Prudence", "direction": "positively related" },
            "subscales": [
              {
                "name": "Standards",
                "low_score": "Relaxed & forgiving about performance standards; may seem careless",
                "high_score": "Exceptionally high standards for self & others; practical, systematic & exacting",
                "sample_item": "I have a reputation for being hard to please."
              },
              {
                "name": "Perfectionistic",
                "low_score": "Action-oriented, works quickly; may neglect important details",
                "high_score": "Perfectionistic about quality; obsessed with details; precise & competitive",
                "sample_item": "It bothers me when others don't proofread their work."
              },
              {
                "name": "Organized",
                "low_score": "Flexible; able to work in ambiguity; inattentive to rules",
                "high_score": "Meticulous & thorough, but inflexible about schedules, rules & procedures",
                "sample_item": "I like to make a schedule and stick to it."
              }
            ]
          },
          "Dutiful": {
            "cluster": "Moving Toward",
            "everyday_strength": "Supportive & loyal",
            "overused_risk": "Over-eager to please, deferential, & ingratiating",
            "hpi_relationship": { "scale": "Interpersonal Sensitivity", "direction": "positively related" },
            "subscales": [
              {
                "name": "Indecisive",
                "low_score": "Independent & self-sufficient; may dismiss input too quickly",
                "high_score": "Depends on others for advice & reluctant to act independently",
                "sample_item": "I am sometimes slow making decisions because I can't make up my mind."
              },
              {
                "name": "Ingratiating",
                "low_score": "Self-reliant & tough-minded; may be insubordinate or disloyal",
                "high_score": "Excessively eager to please superiors; deferential & hesitant to express opinions",
                "sample_item": "It is often smart to tell your boss what he/she wants to hear."
              },
              {
                "name": "Conforming",
                "low_score": "Willing to express opinions; may seem rebellious or inappropriately challenging",
                "high_score": "Takes pride in supporting superiors & following orders; obedient & compliant",
                "sample_item": "Being loyal to my boss is important to me."
              }
            ]
          }
        }
      },

      "MVPI": {
        "full_name": "Motives, Values, Preferences Inventory",
        "label": "The Inside",
        "measures": "Core goals, values, drivers, and interests — what a person desires and strives to attain",
        "score_format": "Percentile",
        "completion_time_minutes": "15-20",
        "scoring_bands": {
          "three_level": {
            "Low": { "min": 0, "max": 35 },
            "Average": { "min": 36, "max": 64 },
            "High": { "min": 65, "max": 100 }
          },
          "four_level": {
            "Low": { "min": 0, "max": 25 },
            "Below Average": { "min": 26, "max": 50 },
            "Above Average": { "min": 51, "max": 75 },
            "High": { "min": 76, "max": 100 }
          }
        },
        "uses": [
          "Compatibility with organizational culture",
          "Employee motivation factors",
          "Career motivation",
          "Leadership environment one might create"
        ],
        "primary_scale_count": 10,
        "subscales_per_scale": 5,
        "total_subscale_count": 50,
        "subscale_categories": ["Lifestyles", "Beliefs", "Occupational Preferences", "Aversions", "Preferred Associates"],
        "clusters": {
          "Status Interests": ["Recognition", "Power", "Hedonism"],
          "Social Interests": ["Altruistic", "Affiliation", "Tradition"],
          "Financial Interests": ["Security", "Commerce"],
          "Decision-Making Style": ["Aesthetics", "Science"]
        },
        "scales": {
          "Recognition": {
            "cluster": "Status Interests",
            "high_definition": "Desire to be known, seen, visible, and famous; lifestyle guided by search for opportunities to be noticed",
            "low_values": "Modesty, behind-the-scenes roles",
            "high_values": "Public acknowledgement, visibility",
            "unconscious_bias": "Will want center of attention; assumes others need attention as much as they do; will not understand modesty",
            "correlations": ["Sociability+", "Bold+", "Mischievous+", "Colorful+", "Imaginative+"],
            "subscales": [
              { "name": "Lifestyles", "definition": "Degree to which lifestyle reflects interest in being known/recognized", "sample_item": "I won't be satisfied until I am famous." },
              { "name": "Beliefs", "definition": "Strength of belief that recognition is important", "sample_item": "Everyone should have their 15 minutes of fame." },
              { "name": "Occupational Preferences", "definition": "Level of interest in a job that offers recognition", "sample_item": "I would love to be a TV celebrity." },
              { "name": "Aversions", "definition": "Degree of displeasure when achievements are not recognized", "sample_item": "It bothers me when my good work is not recognized." },
              { "name": "Preferred Associates", "definition": "Strength of desire to associate with high-profile people", "sample_item": "I want to have famous friends." }
            ]
          },
          "Power": {
            "cluster": "Status Interests",
            "high_definition": "Desire to succeed, make things happen, make a difference, and outperform competition",
            "low_values": "Cooperation, democratic decision-making",
            "high_values": "Authority, top-down influence, impact",
            "unconscious_bias": "Will want to win; assumes others are as competitive; dislikes people who lack a winning attitude",
            "correlations": ["Ambition+", "Sociability+", "Bold+", "Mischievous+", "Colorful+", "Imaginative+"],
            "subscales": [
              { "name": "Lifestyles", "definition": "Degree to which lifestyle reflects pursuit of influence and power", "sample_item": "I enjoy competing and testing my skills." },
              { "name": "Beliefs", "definition": "Strength of belief that competition and success are important", "sample_item": "Life is about winning." },
              { "name": "Occupational Preferences", "definition": "Level of desire for a high-powered career", "sample_item": "I want to be a powerful person in society." },
              { "name": "Aversions", "definition": "Degree of displeasure with laziness or lack of effort", "sample_item": "I dislike people who have no desire to improve their status in life." },
              { "name": "Preferred Associates", "definition": "Strength of desire to associate with powerful, influential people", "sample_item": "I am friends with some very driven people." }
            ]
          },
          "Hedonism": {
            "cluster": "Status Interests",
            "high_definition": "Pursuit of fun, excitement, pleasure; lifestyle organized around entertaining and having fun",
            "low_values": "Professional, formal work environments",
            "high_values": "Fun, lighthearted, open minded cultures",
            "unconscious_bias": "Assumes others are as fun-seeking; will not understand overly serious people",
            "correlations": ["Prudence-", "Skeptical+", "Mischievous+"],
            "subscales": [
              { "name": "Lifestyles", "definition": "Degree to which lifestyle reflects interest in pleasure, variety, and fun", "sample_item": "I am known as a playful person." },
              { "name": "Beliefs", "definition": "Strength of belief that life is for enjoyment", "sample_item": "I believe in working hard and playing hard." },
              { "name": "Occupational Preferences", "definition": "Level of desire for variety and excitement in one's job", "sample_item": "A good job is one with lots of opportunities to travel." },
              { "name": "Aversions", "definition": "Degree of aversion to overly serious environments and people", "sample_item": "I don't like serious, uptight people." },
              { "name": "Preferred Associates", "definition": "Strength of desire to associate with fun, light-hearted individuals", "sample_item": "My best friends invite me to lots of great parties." }
            ]
          },
          "Altruistic": {
            "cluster": "Social Interests",
            "high_definition": "Desire to help others; concern for welfare of others; lifestyle organized around public service",
            "low_values": "Personal responsibility, self-reliance",
            "high_values": "Helping others, coaching, providing service",
            "unconscious_bias": "Wants to help less privileged; assumes others share concern; will not understand need for self-reliance",
            "correlations": ["Interpersonal Sensitivity+", "Reserved-", "Diligent+", "Dutiful+"],
            "subscales": [
              { "name": "Lifestyles", "definition": "Degree of interest in a lifestyle that involves helping others", "sample_item": "I wish I could do more to eliminate hunger in the world." },
              { "name": "Beliefs", "definition": "Strength of belief that helping others is important and worthwhile", "sample_item": "Helping others is one of the most important things one can do." },
              { "name": "Occupational Preferences", "definition": "Level of desire for a job in which one can help others", "sample_item": "I enjoy teaching young people." },
              { "name": "Aversions", "definition": "Degree of discomfort when people in need are ignored", "sample_item": "I am annoyed by greedy, selfish people." },
              { "name": "Preferred Associates", "definition": "Strength of desire to associate with helpful and giving people", "sample_item": "I met many of my friends through volunteer events." }
            ]
          },
          "Affiliation": {
            "cluster": "Social Interests",
            "high_definition": "Needing and enjoying frequent and varied social contact; lifestyle organized around social interaction",
            "low_values": "Privacy, task-focus, minimal interruptions",
            "high_values": "Networking, relationships, teamwork, belonging",
            "unconscious_bias": "Assumes others want social interaction as much; will not understand preference for solitude",
            "subscales": [
              { "name": "Lifestyles", "definition": "Degree of interest in connecting, networking and relationships", "sample_item": "I like attending big public events." },
              { "name": "Beliefs", "definition": "Strength of belief that relationships are important", "sample_item": "It is important to have a large circle of friends." },
              { "name": "Occupational Preferences", "definition": "Level of desire for a job with opportunities to work with others", "sample_item": "I enjoy team projects at work." },
              { "name": "Aversions", "definition": "Degree of distress with social isolation or spending time alone", "sample_item": "I don't understand people who can stay home night after night." },
              { "name": "Preferred Associates", "definition": "Strength of desire to associate with sociable, gregarious people", "sample_item": "I have always enjoyed being a part of a group." }
            ]
          },
          "Tradition": {
            "cluster": "Social Interests",
            "high_definition": "Belief in and dedication to conventions — family, religious affiliation, thrift, hard work, appropriate social behavior",
            "low_values": "Progress, diversity, autonomy",
            "high_values": "Role clarity, conservative, principled cultures",
            "unconscious_bias": "Will judge others by traditional standards; may not value unconventional approaches",
            "subscales": [
              { "name": "Lifestyles", "definition": "Degree to which lifestyle reflects a clear sense of right and wrong", "sample_item": "I always look forward to the traditional holidays." },
              { "name": "Beliefs", "definition": "Strength of belief that maintaining tradition is important", "sample_item": "Society was stronger when people respected our customs." },
              { "name": "Occupational Preferences", "definition": "Level of desire for a job with clear expectations", "sample_item": "I prefer to work with people who respect positions of authority." },
              { "name": "Aversions", "definition": "Degree of displeasure when others violate or disrespect tradition", "sample_item": "I don't understand people with no concept of right or wrong." },
              { "name": "Preferred Associates", "definition": "Strength of desire to associate with those who share one's values", "sample_item": "My friends share moral and ethical values." }
            ]
          },
          "Security": {
            "cluster": "Financial Interests",
            "high_definition": "Need for predictability and structure; efforts to avoid risk and uncertainty",
            "low_values": "Risk-taking, limit-testing, experimentation",
            "high_values": "Structure, order, predictability",
            "unconscious_bias": "Assumes others value stability; will not understand risk-seekers",
            "subscales": [
              { "name": "Lifestyles", "definition": "Degree to which lifestyle choices reflect a need for stability and order", "sample_item": "I would rather be safe than sorry." },
              { "name": "Beliefs", "definition": "Strength of belief that avoiding risk is important", "sample_item": "There is no such thing as being too careful." },
              { "name": "Occupational Preferences", "definition": "Level of desire for a steady, predictable and secure job", "sample_item": "Job security is more important than job satisfaction." },
              { "name": "Aversions", "definition": "Degree of discomfort with risky behavior or decisions", "sample_item": "I don't understand unpredictable people." },
              { "name": "Preferred Associates", "definition": "Strength of desire to associate with reliable and stable people", "sample_item": "I prefer cautious people as my friends." }
            ]
          },
          "Commerce": {
            "cluster": "Financial Interests",
            "high_definition": "Interest in earning money, realizing profits, finding business opportunities",
            "low_values": "Cooperation, less focus on bottom line",
            "high_values": "Making money, focus on bottom line",
            "unconscious_bias": "Assumes financial incentives motivate everyone; may not understand intrinsic motivation",
            "subscales": [
              { "name": "Lifestyles", "definition": "Degree to which lifestyle reflects pursuit of financial interests", "sample_item": "My goal in life is to make lots of money." },
              { "name": "Beliefs", "definition": "Strength of belief that pursuit of financial gain is important", "sample_item": "A person can never be too rich." },
              { "name": "Occupational Preferences", "definition": "Level of desire for a lucrative job", "sample_item": "I would like to run my own business." },
              { "name": "Aversions", "definition": "Degree of aversion to financial irresponsibility and losing money", "sample_item": "I get annoyed when I pay more for something than I need to." },
              { "name": "Preferred Associates", "definition": "Strength of desire to associate with financially successful people", "sample_item": "Many of my friends are important business people." }
            ]
          },
          "Aesthetics": {
            "cluster": "Decision-Making Style",
            "high_definition": "Need for self-expression; dedication to quality; interest in how things look, feel, and sound",
            "low_values": "Functionality and substance over form",
            "high_values": "Quality, image, and product look & feel",
            "unconscious_bias": "Will judge work by appearance; may over-invest in aesthetics at expense of function",
            "subscales": [
              { "name": "Lifestyles", "definition": "Degree to which lifestyle reflects an interest in creative pursuits", "sample_item": "I pay attention to new trends in fashion." },
              { "name": "Beliefs", "definition": "Strength of belief that creative expression is important", "sample_item": "People should visit art museums more often." },
              { "name": "Occupational Preferences", "definition": "Level of desire for a job requiring creativity or artistic skill", "sample_item": "My idea of a great job is an artist." },
              { "name": "Aversions", "definition": "Degree of displeasure with poor taste and unattractive surroundings", "sample_item": "I dislike being with people who have no interest in the arts." },
              { "name": "Preferred Associates", "definition": "Strength of desire to associate with artistic and creative people", "sample_item": "Many of my friends are active in the arts." }
            ]
          },
          "Science": {
            "cluster": "Decision-Making Style",
            "high_definition": "Interest in science; comfortable with technology; prefers data-based decisions; wants to know how things work",
            "low_values": "Experience-based, intuitive decisions",
            "high_values": "Analytics, data-driven decision making",
            "unconscious_bias": "Assumes data should drive all decisions; may not value intuitive approaches",
            "subscales": [
              { "name": "Lifestyles", "definition": "Degree to which lifestyle reflects an interest in scientific research", "sample_item": "I base my decisions on reason, logic, and evidence." },
              { "name": "Beliefs", "definition": "Strength of belief in the pursuit of scientific advancement", "sample_item": "I believe science is the key to human progress." },
              { "name": "Occupational Preferences", "definition": "Level of interest in a job involving research or scientific inquiry", "sample_item": "I would like a job doing research." },
              { "name": "Aversions", "definition": "Degree of discomfort when facts and data are ignored or dismissed", "sample_item": "I dislike making decisions without gathering all the facts." },
              { "name": "Preferred Associates", "definition": "Strength of desire to associate with scientifically-minded people", "sample_item": "Many of my friends are scientists." }
            ]
          }
        }
      }
    },

    "summary_counts": {
      "HPI": { "primary_scales": 7, "subscales": 41, "special_scales": 1 },
      "HDS": { "primary_scales": 11, "subscales": 33 },
      "MVPI": { "primary_scales": 10, "subscales": 50 },
      "total_primary_scales": 28,
      "total_subscales": 124,
      "total_special_scales": 1,
      "grand_total_scored_dimensions": 153
    }

}
}
