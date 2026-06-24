import "dotenv/config";
import { PrismaClient, PostStatus } from "../app/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import bcrypt from "bcryptjs";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const whoWeAreContent = `Who we are
We are a team of dedicated change-makers committed to empowering marginalized communities, promotes equality, and fosters a brighter, more inclusive future for all.

Humanist Watch Salone (HUWASAL) is a human rights and development-based organization committed to empowering marginalized groups, including women, youth, children, and the persons with different abilities to determine their own choices, and their rights to influence social change.   Established in 2003 and registered in Sierra Leone as a Private Company Limited by Guarantee, HUWASAL envisions a poverty-free society where everyone can reach their full potential to influence and actively participate in decisions that affect their welbing. The organization focuses on human rights, governance, community health, and child protection, working through grassroots initiatives to promote equality and sustainable development.
Governed by a seven-member advisory board, HUWASAL partners with local and international organizations to drive impactful community projects. Its work promotes gender equality, good governance and human rights, violence prevention, responsible land governance and investment, environmental and climate justice, community health and sanitation, child protection and development, peace building and inclusive development. HUWASAL is dedicated to improving lives through advocacy and empowerment. Together, we believe that every helping hand can uplift marginalized communities and shape a better future for all.`;

const missionContent = `Our Mission
HUWASAL ensures all individuals get equal treatment, empowerment, and opportunities.
Our mission at Humanist Watch Salone (HUWASAL) is to empower marginalized communities by promoting human rights, social and environmental justice, and sustainable development. We strive to create a society where women, children, youth, and persons with different abilities can realize their full potential and actively participate in decision-making processes and development. We aim to foster lasting change, ensuring that every individual has the opportunity to a dignified and fulfilling life.`;

const visionContent = `Our Vision
We strive to ensure every marginalized communities/group receives equitable support, never feeling alone or neglected.
Humanist Watch Salone envisions a poverty free Sierra Leone, where poor and disadvantaged women, children, youth and persons with different abilities are empowered to realize their full potential and meaningfully contribute to development initiatives in their communities.`;

const whatWeDoContent = `What We Do
HUWASAL empowers women, youth, children and persons with different abilities to demand their choices, realize their full potential and actively participate in shaping progressive future of their communities.

HUWASAL work in highly deprived and mostly isolated communities with limited social infrastructures that disable communities to thrive and connect. Our target groups include women, youth, children and persons with different abilities as well as those living with HIV and AIDS. These serving groups of HUWASAL are predominantly faced with marginalization due to existing cultural beliefs and attitudes that undermine their social, economic and political status. The social marginalization of the target groups served as a link to their vulnerability as it emphasizes their dependency.

We Find and Fund

We identify and support community-driven initiatives that engender community sense of ownership and determination to drive social change and inclusive growth.

We Educate

We educate and inspire communities to think creatively and become problem solvers by providing them with practical guides and procedures for handling unprecedented situation that undermines their survival and social well-being.

We Provide

We provide preventative, responsive and promotive social services that alleviate poverty, challenge and reduce discrimination, advance social and environmental justice, human rights and good governance, youth empowerment, health and sanitation, child protection and development, and prevent and respond to violence, abuse of women and girls.
We consult
We seek information and opportunities that enable us provide impactful services to communities and individuals within our target

We Build
We build trust in what we do through open communication to our partners as well as communities and individuals we serve so they will know; the services we provide, how we provide services, the benefit of our services and resources used in service provision.

We Strengthen
We work towards strengthening communities' involvement in what we do through collaboration and engagement, inclusivity, resilience building and creating a thriving environment for everyone. By doing so: we bring communities together to foster a sense of share purpose and ownership; create platform for open dialogue, problem-solving, and decision-making, ensuring diverse voices are heard; Actively seek out and include individuals who experience poverty, disadvantage, or discrimination, ensuring their needs and perspectives are addressed; Identify and leverage the existing assets and resources within the community, rather than focusing solely on problems; Support people early to prevent negative experiences and build capacity for self-reliance; Encourage shopping locally and organizing community events to boost the local economy and strengthen community bonds; Promote volunteering initiatives to enhance community spirit and create positive impacts; Create a welcoming and inclusive environment for all community members, regardless of background or circumstances.`;

async function main() {
  const email = "superadmin@huwasal.com";
  const password = "admin123";

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    console.log("Superadmin user already exists.");
  } else {
    const hashed = await bcrypt.hash(password, 12);
    await prisma.user.create({
      data: {
        name: "Superadmin",
        email,
        password: hashed,
        role: "SUPERADMIN",
      },
    });
    console.log("Superadmin created:");
    console.log("  Email:    superadmin@huwasal.com");
    console.log("  Password: admin123");
  }

  const org = await prisma.organization.findFirst();
  if (!org) {
    await prisma.organization.create({
      data: {
        name: "Humanist Watch Salone",
        tagline: "Empowering communities, defending rights, building a better future for all.",
        email: "info@huwasal.com",
        phone: "+232 00 000 0000",
        description: "Humanist Watch Salone (HUWASAL) is a human rights and development-based organization committed to empowering marginalized groups in Sierra Leone.",
        whoWeAre: whoWeAreContent,
        mission: missionContent,
        vision: visionContent,
        whatWeDo: whatWeDoContent,
      },
    });
    console.log("Organization created with seed content.");
  } else {
    console.log("Organization already exists. Updating seed content...");
    await prisma.organization.update({
      where: { id: org.id },
      data: {
        whoWeAre: whoWeAreContent,
        mission: missionContent,
        vision: visionContent,
        whatWeDo: whatWeDoContent,
      },
    });
    console.log("Organization updated with seed content.");
  }

  console.log("Done. Edit content anytime via Admin > Site Settings.");
}

async function seedPrograms() {
  const admin = await prisma.user.findFirst({ where: { role: "SUPERADMIN" } });
  if (!admin) {
    console.log("No admin user found. Skipping programs seed.");
    return;
  }

  const existingCount = await prisma.program.count();
  if (existingCount > 0) {
    console.log("Programs already exist. Re-seeding with latest content...");
    await prisma.program.deleteMany({});
  }

  const programs = [
    {
      title: "Protection and Empowerment of Vulnerable Populations",
      slug: "protection-and-empowerment",
      description: "Protection and empowerment of vulnerable populations including women and girls against human rights abuse and exploitation.",
      content: `Protection and empowerment of vulnerable populations including women and girls against human rights abuse and exploitation.

We provide psycho-social support to victims of human rights abuse including SGBV to access justice as well as community educative platform on gender transformational and community legal empowerment for the less privileged voices to reach and stimulate relevant stakeholders in response to their interests and concerns thus creating violence free environment for all.`,
      published: true,
      icon: "shield",
    },
    {
      title: "Enhancing Economic Security for Women, Youth and Other Vulnerable Groups",
      slug: "enhancing-economic-security",
      description: "We provide better livelihood opportunities for the less privileged population including women, young people and persons with different abilities.",
      content: `Enhancing economic security for women, youth and other vulnerable groups.

We provide better livelihood opportunities for the less privileged population including women, young people and persons with different abilities through livelihood skills development, income generating activities and employability empowerment.`,
      published: true,
      icon: "currency",
    },
    {
      title: "Supporting Communities for Social Cohesion",
      slug: "social-cohesion",
      description: "We work towards building support for communities to interact with free mind as citizens, manage emerging conflict, and shift discriminatory cultural norms.",
      content: `Supporting communities for social cohesion through reconciliation dialogue, social accountability and gender-aware development.

We work towards building support for communities to interact with free mind as citizens, manage emerging conflict, shift discriminatory cultural norms, considered and benefit equally from development with opportunity to assess social service delivery will greatly contribute towards promoting peace, social cohesion and national unity. As such, we facilitate community knowledge building campaigns on peace building, inclusive governance and development including women's protection and empowerment through outreach sessions, trainings, media engagements and IEC/BCC materials production and distribution. These contributes to building synergies of community structures to become peace and development ambassadors in communities.`,
      published: true,
      icon: "handshake",
    },
    {
      title: "Improvement on Social Accountability and Citizens Trust",
      slug: "social-accountability",
      description: "Monitor access to services for citizens and bring a dream for healthy communities and progressive development outcomes.",
      content: `Improvement on social accountability and citizens trust in social service delivery.

Monitor (through physical visits, surveys, desk reviews and other applicable means) access to services for citizens, containing education, health care, clean water supply, food security, justice and security and other services that addresses challenges of citizens wellbeing.

Bringing a dream for healthy communities and progressive development outcomes.

We Educate and mobilize communities on maintaining of basic health practices, promote WASH activities in rural communities and learning institutions, sustainable use of the environment to mitigate climate change and right to food by strengthening climate – smart agricultural activities that include climate and care initiatives. We also, embark on advocacy for accessible, available and affordable health care delivery for communities and responsible governance of natural resources and investment within human rights standard.`,
      published: true,
      icon: "chart",
    },
    {
      title: "Child Protection and Child Personal Development",
      slug: "child-protection",
      description: "Community awareness raising on issues that undermine child personal development such as child sexual exploitation and abuse, child labor, child trafficking, early marriages and teenage pregnancy.",
      content: `Child protection and child personal development.

We work towards:
Community awareness raising on issues that undermine child personal development such as child sexual exploitation and abuse, child labor, child trafficking, early marriages and teenage pregnancy;
Monitoring and documentation of issues related to children in contact with the law as well as provide legal aid services and develop functional case management system;
Provision of social services to enhance transformation of street child;
Provision of educational support for vulnerable children including orphans and disabled children and advocacy for the creation of model child friendly learning environment.`,
      published: true,
      icon: "child",
    },
  ];

  for (const prog of programs) {
    await prisma.program.create({
      data: {
        ...prog,
        userId: admin.id,
      },
    });
  }

  console.log(`Seeded ${programs.length} programs.`);
}

async function seedBlogPosts() {
  const admin = await prisma.user.findFirst({ where: { role: "SUPERADMIN" } });
  if (!admin) {
    console.log("No admin user found. Skipping blog seed.");
    return;
  }

  const existingCount = await prisma.blogPost.count();
  if (existingCount > 0) {
    console.log("Blog posts already exist. Re-seeding with latest content...");
    await prisma.blogPost.deleteMany({});
  }

  const posts = [
    {
      title: "HUWASAL Annual Report 2025: A Year of Impact",
      slug: "huwasal-annual-report-2025",
      excerpt: "Discover how HUWASAL's programs transformed lives across Sierra Leone in 2025, reaching over 10,000 community members.",
      content: `HUWASAL Annual Report 2025: A Year of Impact

      This past year has been one of remarkable growth and impact for Humanist Watch Salone. We reached over 10,000 community members across five districts in Sierra Leone.

      Our programs focused on human rights education, economic empowerment, and child protection saw unprecedented engagement from communities.

      Key Achievements

      We trained 500 women in livelihood skills, providing them with the tools to start small businesses and support their families. Our child protection initiatives reached 2,000 children with educational support and legal aid services.

      Through our social accountability programs, we facilitated 50 community dialogue sessions that brought together citizens and local government officials to improve service delivery.

      Looking Ahead

      As we move into 2026, we are expanding our programs to reach more communities. We invite you to join us in this journey of transformation and hope.`,
      image: null,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date("2026-01-15"),
    },
    {
      title: "Empowering Women Through Skills Training in Rural Communities",
      slug: "empowering-women-skills-training",
      excerpt: "Our livelihood skills program is transforming the lives of women in rural Sierra Leone, one training session at a time.",
      content: `Empowering Women Through Skills Training in Rural Communities

      In the rural communities of Sierra Leone, women face unique challenges in accessing economic opportunities. HUWASAL's livelihood skills training program is changing this narrative.

      The program provides practical training in tailoring, soap making, food processing, and small business management. Participants also receive mentorship and startup kits to launch their own enterprises.

      Success Stories

      Mariatu, a 32-year-old mother of three from the Kailahun district, completed our tailoring program in 2025. Today, she runs a thriving tailoring business that supports her entire family.

      "Before this training, I had no way to earn an income. Now I can pay my children's school fees and contribute to my community," Mariatu shares.

      Program Impact

      Since its inception, the program has trained over 500 women, with 80% successfully starting their own businesses. This economic empowerment has ripple effects throughout communities, improving nutrition, education, and overall well-being.`,
      image: null,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date("2026-03-10"),
    },
    {
      title: "Child Protection: Building Safe Spaces for Vulnerable Children",
      slug: "child-protection-safe-spaces",
      excerpt: "HUWASAL's child protection initiatives create safe environments where vulnerable children can learn, grow, and thrive.",
      content: `Child Protection: Building Safe Spaces for Vulnerable Children

      Every child deserves a safe environment to grow, learn, and thrive. In Sierra Leone, many children face threats including child labor, exploitation, and lack of access to education.

      HUWASAL's child protection program works tirelessly to create safe spaces for vulnerable children across the country.

      Our Approach

      We work with communities to identify children at risk and provide them with educational support, legal aid, and psychosocial counseling. Our team also conducts awareness campaigns on child rights and protection.

      Community Engagement

      Through our community outreach programs, we have engaged over 200 community leaders in child protection dialogues. These leaders now serve as child protection advocates in their communities.

      The impact has been significant. School enrollment has increased, and cases of child abuse are being reported and addressed more effectively.`,
      image: null,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date("2026-04-22"),
    },
    {
      title: "Promoting Peace and Social Cohesion in Sierra Leone",
      slug: "promoting-peace-social-cohesion",
      excerpt: "Through dialogue and community engagement, HUWASAL is building bridges and fostering peace in diverse communities.",
      content: `Promoting Peace and Social Cohesion in Sierra Leone

      In a country with a complex history, building and maintaining peace requires continuous effort and dedication. HUWASAL's social cohesion program brings together diverse community members to foster understanding and collaboration.

      Our peacebuilding initiatives focus on dialogue, conflict resolution training, and community mediation. We work with youth, women, and traditional leaders to create platforms for constructive conversation.

      Community Dialogue Sessions

      Our dialogue sessions create safe spaces where community members can discuss sensitive issues, resolve conflicts, and build mutual understanding. These sessions have been instrumental in preventing conflicts and strengthening community bonds.

      Youth Peace Ambassadors

      We train young people as peace ambassadors who then work within their communities to promote peace and prevent violence. These youth leaders organize community events, lead discussions, and serve as role models for their peers.

      The program has reached over 3,000 community members and has contributed to significant reductions in local conflicts.`,
      image: null,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date("2026-05-08"),
    },
    {
      title: "Climate Justice: Communities Taking Action for a Sustainable Future",
      slug: "climate-justice-communities",
      excerpt: "Rural communities in Sierra Leone are leading the fight against climate change with support from HUWASAL's environmental programs.",
      content: `Climate Justice: Communities Taking Action for a Sustainable Future

      Climate change disproportionately affects vulnerable communities in Sierra Leone. HUWASAL's climate justice program empowers communities to take action and advocate for their environmental rights.

      Our program combines environmental education with practical action. We train community members in sustainable farming practices, tree planting, and natural resource management.

      Community-led Initiatives

      In partnership with local communities, we have planted over 10,000 trees across deforested areas. Community members have been trained in climate-smart agriculture, reducing their vulnerability to climate shocks.

      Advocacy for Environmental Justice

      We support communities in advocating for their environmental rights and holding duty-bearers accountable. Our advocacy efforts have contributed to improved environmental policies at the local level.

      The road ahead is long, but with community leadership and collective action, a sustainable future is within reach.`,
      image: null,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date("2026-06-01"),
    },
    {
      title: "Youth Empowerment: Shaping the Leaders of Tomorrow",
      slug: "youth-empowerment-leaders",
      excerpt: "HUWASAL invests in young people through leadership training, civic education, and economic opportunity programs.",
      content: `Youth Empowerment: Shaping the Leaders of Tomorrow

      Young people are the future of Sierra Leone. HUWASAL's youth empowerment programs provide young men and women with the skills, knowledge, and opportunities they need to become leaders in their communities.

      Our programs focus on leadership development, civic education, vocational training, and entrepreneurship. We believe that investing in youth is the most effective way to create lasting change.

      Leadership Training

      Our annual youth leadership camp brings together young people from across the country for intensive training in leadership, advocacy, and community organizing. Graduates of the program go on to lead community initiatives and inspire their peers.

      Civic Education

      We educate young people about their rights and responsibilities as citizens. Through workshops and community projects, participants learn about governance, democracy, and how to engage with local authorities.

      Economic Opportunities

      Vocational training and entrepreneurship support help young people build sustainable livelihoods. From tailoring to information technology, our programs open doors to economic independence.

      Together, we are nurturing the next generation of Sierra Leonean leaders.`,
      image: null,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date("2026-06-15"),
    },
  ];

  for (const post of posts) {
    await prisma.blogPost.create({
      data: {
        ...post,
        userId: admin.id,
      },
    });
  }

  console.log(`Seeded ${posts.length} blog posts.`);
}

async function seedEvents() {
  const existingCount = await prisma.event.count();
  if (existingCount > 0) {
    console.log("Events already exist. Re-seeding with latest content...");
    await prisma.event.deleteMany({});
  }

  const events = [
    {
      name: "Annual Community Outreach and Health Fair 2026",
      slug: "annual-community-outreach-2026",
      description: "Join HUWASAL for our annual community outreach and health fair, providing free health screenings, educational resources, and support services to communities in the Kailahun district. This year's event will feature mobile clinics, child protection awareness sessions, and livelihood skills demonstrations. Community members will have access to free medical check-ups, family planning services, and nutritional counseling. Our team of healthcare professionals and social workers will be on hand to provide personalized support and guidance.",
      location: "Kailahun District, Sierra Leone",
      date: new Date("2026-08-15"),
      published: true,
    },
    {
      name: "Women's Empowerment Workshop: Skills for Life",
      slug: "womens-empowerment-workshop-2026",
      description: "A three-day intensive workshop focused on empowering women through practical skills training in tailoring, soap making, and small business management. Participants will also receive mentorship and startup kits. The workshop includes sessions on financial literacy, digital skills, and leadership development. Guest speakers from successful women-led businesses will share their experiences and insights. Lunch and materials will be provided free of charge.",
      location: "HUWASAL Training Center, Freetown",
      date: new Date("2026-09-20"),
      published: true,
    },
    {
      name: "Youth Leadership and Civic Engagement Forum",
      slug: "youth-leadership-forum-2026",
      description: "An engaging forum bringing together young leaders from across Sierra Leone for training in advocacy, community organizing, and civic participation. The forum includes panel discussions, hands-on workshops, and networking opportunities with experienced leaders and policymakers. Topics include effective communication, project management, peacebuilding, and environmental advocacy. Youth participants will develop action plans for community projects they will lead in their respective regions.",
      location: "Makeni City, Northern Province",
      date: new Date("2026-10-10"),
      published: true,
    },
    {
      name: "Child Rights Awareness Week",
      slug: "child-rights-awareness-week-2026",
      description: "A week-long campaign dedicated to raising awareness about child rights and protection in Sierra Leone. Activities include school visits, community dialogues, radio discussions, and legal aid clinics for children and families. Our team will distribute educational materials and conduct interactive sessions on child safety, the dangers of child labor, and the importance of education. Parents and guardians are invited to attend special sessions on positive parenting and child welfare.",
      location: "Multiple locations across Sierra Leone",
      date: new Date("2026-11-05"),
      published: true,
    },
    {
      name: "Peacebuilding and Social Cohesion Dialogue",
      slug: "peacebuilding-dialogue-2026",
      description: "A community dialogue event focused on promoting peace, reconciliation, and social cohesion in post-conflict communities. The event brings together traditional leaders, youth representatives, women's groups, and local authorities to foster understanding and collaboration. Facilitated discussions will address conflict resolution mechanisms, inter-community relations, and strategies for sustainable peace. Cultural performances and shared meals will help strengthen community bonds.",
      location: "Kenema City, Eastern Province",
      date: new Date("2026-12-01"),
      published: true,
    },
    {
      name: "Climate Action and Environmental Justice Summit",
      slug: "climate-action-summit-2026",
      description: "HUWASAL's annual summit on climate action and environmental justice brings together environmental activists, community leaders, and policy advocates to discuss climate challenges facing Sierra Leone and develop community-led solutions. The summit features expert presentations, working groups, and practical training sessions on climate-smart agriculture, reforestation, and sustainable resource management. Participants will collaborate on creating a community climate action roadmap for the coming year.",
      location: "Bo City, Sierra Leone",
      date: new Date("2027-01-25"),
      published: true,
    },
  ];

  for (const event of events) {
    await prisma.event.create({ data: event });
  }

  console.log(`Seeded ${events.length} events.`);
}

async function seedTeamMembers() {
  const existingCount = await prisma.teamMember.count();
  if (existingCount > 0) {
    console.log("Team members already exist. Re-seeding with latest content...");
    await prisma.teamMember.deleteMany({});
  }

  const members = [
    {
      name: "Dr. Fatmata Kamara",
      role: "Executive Director",
      bio: "Dr. Fatmata Kamara is the founding Executive Director of Humanist Watch Salone (HUWASAL). With over 20 years of experience in human rights advocacy and community development, she has led numerous initiatives that have transformed lives across Sierra Leone. She holds a PhD in Development Studies from the University of Sierra Leone and has received several international awards for her work in women's empowerment and child protection. Dr. Kamara is passionate about creating sustainable change through community-led initiatives and believes that every individual has the power to make a difference.",
      email: "fatmata.kamara@huwasal.com",
      order: 1,
      published: true,
    },
    {
      name: "Mohamed Sesay",
      role: "Programs Director",
      bio: "Mohamed Sesay oversees the design, implementation, and monitoring of all HUWASAL programs. With a Master's degree in Project Management and over 15 years of experience in the NGO sector, he brings strategic vision and operational excellence to the organization. Mohamed has successfully managed multi-donor projects focused on governance, social accountability, and community health. He is committed to ensuring that HUWASAL's programs deliver measurable impact and are responsive to community needs.",
      email: "mohamed.sesay@huwasal.com",
      order: 2,
      published: true,
    },
    {
      name: "Hawa Bangura",
      role: "Finance & Admin Manager",
      bio: "Hawa Bangura manages the financial operations and administrative functions of HUWASAL. She is a certified accountant with over 12 years of experience in financial management within the development sector. Hawa ensures transparency, accountability, and compliance with donor requirements across all organizational activities. She holds a Bachelor's degree in Accounting and Finance and is known for her meticulous attention to detail and commitment to good governance.",
      email: "hawa.bangura@huwasal.com",
      order: 3,
      published: true,
    },
    {
      name: "Alhaji Koroma",
      role: "Field Operations Coordinator",
      bio: "Alhaji Koroma coordinates HUWASAL's field operations across five districts in Sierra Leone. With extensive experience in community engagement and grassroots organizing, he ensures that programs reach the most vulnerable populations in remote and underserved areas. Alhaji has a background in social work and community development, and is deeply respected by community leaders for his dedication, cultural sensitivity, and ability to build trust with diverse groups.",
      email: "alhaji.koroma@huwasal.com",
      order: 4,
      published: true,
    },
    {
      name: "Mariatu Jalloh",
      role: "Child Protection Officer",
      bio: "Mariatu Jalloh leads HUWASAL's child protection programs, focusing on preventing child abuse, exploitation, and violence. She has a law degree and specialized training in child rights and protection. Mariatu works closely with communities, schools, and law enforcement agencies to create safe environments for children. She has successfully advocated for the reintegration of over 200 street-connected children with their families and provides legal aid to child victims of abuse.",
      email: "mariatu.jalloh@huwasal.com",
      order: 5,
      published: true,
    },
    {
      name: "Sorie Kamara",
      role: "Monitoring & Evaluation Officer",
      bio: "Sorie Kamara is responsible for monitoring and evaluating the impact of HUWASAL's programs. He holds a Master's degree in Statistics and has over eight years of experience in data collection, analysis, and reporting. Sorie designs M&E frameworks, conducts field assessments, and ensures that program data informs decision-making and continuous improvement. His work has been instrumental in demonstrating the effectiveness of HUWASAL's interventions to donors and stakeholders.",
      email: "sorie.kamara@huwasal.com",
      order: 6,
      published: true,
    },
    {
      name: "Aminata Sankoh",
      role: "Gender & Advocacy Officer",
      bio: "Aminata Sankoh leads HUWASAL's gender equality and advocacy initiatives. She is a passionate feminist with a Bachelor's degree in Gender Studies and extensive experience in campaigning for women's rights and social justice. Aminata has organized numerous community dialogues on gender-based violence, facilitated leadership training for women, and successfully advocated for policy changes at the local government level. She believes that gender equality is essential for sustainable development.",
      email: "aminata.sankoh@huwasal.com",
      order: 7,
      published: true,
    },
    {
      name: "Ibrahim Turay",
      role: "Communications Officer",
      bio: "Ibrahim Turay manages HUWASAL's communications, media relations, and digital presence. He is a skilled journalist and content creator with a degree in Mass Communications. Ibrahim produces compelling stories that highlight the impact of HUWASAL's work, manages social media platforms, and engages with local and international media outlets. His storytelling has helped raise awareness about the challenges facing marginalized communities and has mobilized support for HUWASAL's programs.",
      email: "ibrahim.turay@huwasal.com",
      order: 8,
      published: true,
    },
  ];

  for (const member of members) {
    await prisma.teamMember.create({ data: member });
  }

  console.log(`Seeded ${members.length} team members.`);
}

main()
  .then(() => seedPrograms())
  .then(() => seedBlogPosts())
  .then(() => seedEvents())
  .then(() => seedTeamMembers())
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
