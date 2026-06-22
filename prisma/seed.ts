import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
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

main()
  .then(() => seedPrograms())
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
