import "dotenv/config";
import { PrismaClient, type Prisma } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const DEMO = "[Demo]";

async function main() {
  console.log("Seeding database...");

  // ── Admin user ────────────────────────────────────────────────────────
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@dentalclinic.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Super Admin",
      email: adminEmail,
      passwordHash,
      role: "SUPER_ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "reception@dentalclinic.com" },
    update: {},
    create: {
      name: "Reception Staff",
      email: "reception@dentalclinic.com",
      passwordHash: await bcrypt.hash("Reception123!", 12),
      role: "RECEPTION",
    },
  });

  // ── Site settings ─────────────────────────────────────────────────────
  const existingSettings = await prisma.siteSettings.findFirst();
  if (!existingSettings) {
    await prisma.siteSettings.create({
      data: {
        clinicName: "Aurelia Dental Studio",
        tagline: "Precision dentistry, designed around you.",
        addressLine: "212 Marina Boulevard, Suite 5, San Francisco, CA 94123",
        phone: "+1 (415) 555-0134",
        email: "hello@aureliadental.com",
        whatsappNumber: "14155550134",
        whatsappMessage: "Hello! I'd like to book an appointment.",
        whatsappEnabled: true,
        whatsappPosition: "bottom-right",
        openingHours: [
          { day: "Monday", open: "09:00", close: "18:00", closed: false },
          { day: "Tuesday", open: "09:00", close: "18:00", closed: false },
          { day: "Wednesday", open: "09:00", close: "18:00", closed: false },
          { day: "Thursday", open: "09:00", close: "18:00", closed: false },
          { day: "Friday", open: "09:00", close: "18:00", closed: false },
          { day: "Saturday", open: "10:00", close: "15:00", closed: false },
          { day: "Sunday", open: "", close: "", closed: true },
        ],
        socialLinks: {
          facebook: "https://facebook.com",
          instagram: "https://instagram.com",
          youtube: "https://youtube.com",
          linkedin: "https://linkedin.com",
        },
        googleMapsEmbed:
          "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0!2d-122.42!3d37.77!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1",
        footerText: `© ${new Date().getFullYear()} Aurelia Dental Studio. All rights reserved.`,
      },
    });
  }

  const existingSeo = await prisma.sEOSettings.findFirst();
  if (!existingSeo) {
    await prisma.sEOSettings.create({
      data: {
        defaultTitle: "Aurelia Dental Studio — Premium Dental Care",
        titleTemplate: "%s | Aurelia Dental Studio",
        defaultDescription:
          "Aurelia Dental Studio offers premium, modern dental care — implants, cosmetic dentistry, orthodontics and more, led by an award-winning team.",
        schemaBusinessType: "Dentist",
      },
    });
  }

  // ── Navigation ────────────────────────────────────────────────────────
  const navItems: { label: string; url: string; order: number }[] = [
    { label: "Home", url: "/", order: 0 },
    { label: "About", url: "/about", order: 1 },
    { label: "Treatments", url: "/treatments", order: 2 },
    { label: "Doctors", url: "/doctors", order: 3 },
    { label: "Smile Gallery", url: "/smile-gallery", order: 4 },
    { label: "Technology", url: "/technology", order: 5 },
    { label: "Blog", url: "/blog", order: 6 },
    { label: "Contact", url: "/contact", order: 7 },
  ];
  for (const item of navItems) {
    const existing = await prisma.navigation.findFirst({
      where: { label: item.label, location: "HEADER" },
    });
    if (!existing) {
      await prisma.navigation.create({
        data: { ...item, location: "HEADER", isActive: true },
      });
    }
  }

  // ── Treatment categories ─────────────────────────────────────────────
  const categories = [
    { name: "General Dentistry", slug: "general-dentistry" },
    { name: "Cosmetic Dentistry", slug: "cosmetic-dentistry" },
    { name: "Implant Dentistry", slug: "implant-dentistry" },
    { name: "Orthodontics", slug: "orthodontics" },
    { name: "Pediatric Dentistry", slug: "pediatric-dentistry" },
  ];
  const categoryRecords: Record<string, string> = {};
  for (const [i, c] of categories.entries()) {
    const rec = await prisma.treatmentCategory.upsert({
      where: { slug: c.slug },
      update: {},
      create: { ...c, order: i },
    });
    categoryRecords[c.slug] = rec.id;
  }

  // ── Technologies ──────────────────────────────────────────────────────
  const technologies = [
    { name: "3D Intraoral Scanning", slug: "3d-intraoral-scanning", description: "Digital impressions with zero mess and instant accuracy." },
    { name: "Digital X-Ray", slug: "digital-x-ray", description: "90% less radiation with instant high-resolution imaging." },
    { name: "CAD/CAM Same-Day Crowns", slug: "cadcam-same-day-crowns", description: "Design and mill precision crowns chairside, in a single visit." },
    { name: "Laser Dentistry", slug: "laser-dentistry", description: "Minimally invasive soft-tissue treatment with faster healing." },
    { name: "Guided Implant Surgery", slug: "guided-implant-surgery", description: "Computer-guided placement for sub-millimeter precision." },
    { name: "Digital Smile Design", slug: "digital-smile-design", description: "Preview your new smile before treatment begins." },
  ];
  const techRecords: Record<string, string> = {};
  for (const [i, t] of technologies.entries()) {
    const rec = await prisma.technology.upsert({
      where: { slug: t.slug },
      update: {},
      create: { ...t, order: i, status: "PUBLISHED" },
    });
    techRecords[t.slug] = rec.id;
  }

  // ── Treatments ────────────────────────────────────────────────────────
  const treatments = [
    {
      name: "Dental Implants",
      slug: "dental-implants",
      categorySlug: "implant-dentistry",
      shortDescription: "Permanent, natural-looking tooth replacement anchored in the jawbone.",
      technologies: ["guided-implant-surgery", "3d-intraoral-scanning"],
    },
    {
      name: "Porcelain Veneers",
      slug: "porcelain-veneers",
      categorySlug: "cosmetic-dentistry",
      shortDescription: "Ultra-thin shells that transform shape, color and alignment in two visits.",
      technologies: ["digital-smile-design"],
    },
    {
      name: "Invisalign Clear Aligners",
      slug: "invisalign-clear-aligners",
      categorySlug: "orthodontics",
      shortDescription: "Straighten teeth invisibly with custom 3D-mapped aligners.",
      technologies: ["3d-intraoral-scanning"],
    },
    {
      name: "Teeth Whitening",
      slug: "teeth-whitening",
      categorySlug: "cosmetic-dentistry",
      shortDescription: "Clinically proven whitening for up to 8 shades brighter in one session.",
      technologies: [],
    },
    {
      name: "Root Canal Therapy",
      slug: "root-canal-therapy",
      categorySlug: "general-dentistry",
      shortDescription: "Pain-free, microscope-guided treatment that saves the natural tooth.",
      technologies: ["digital-x-ray"],
    },
    {
      name: "Same-Day Crowns",
      slug: "same-day-crowns",
      categorySlug: "general-dentistry",
      shortDescription: "Custom-milled ceramic crowns designed and fitted in a single appointment.",
      technologies: ["cadcam-same-day-crowns"],
    },
    {
      name: "Full Mouth Rehabilitation",
      slug: "full-mouth-rehabilitation",
      categorySlug: "implant-dentistry",
      shortDescription: "Comprehensive restoration combining implants, crowns and bite correction.",
      technologies: ["guided-implant-surgery", "digital-smile-design"],
    },
    {
      name: "Pediatric Dental Care",
      slug: "pediatric-dental-care",
      categorySlug: "pediatric-dentistry",
      shortDescription: "Gentle, kid-friendly preventive and restorative care.",
      technologies: [],
    },
    {
      name: "Braces & Orthodontics",
      slug: "braces-orthodontics",
      categorySlug: "orthodontics",
      shortDescription: "Traditional and ceramic braces for complex alignment cases.",
      technologies: ["3d-intraoral-scanning"],
    },
    {
      name: "Dental Bridges",
      slug: "dental-bridges",
      categorySlug: "general-dentistry",
      shortDescription: "Fixed restorations that close the gap from one or more missing teeth.",
      technologies: [],
    },
    {
      name: "Gum Contouring",
      slug: "gum-contouring",
      categorySlug: "cosmetic-dentistry",
      shortDescription: "Laser reshaping for a balanced, symmetrical gum line.",
      technologies: ["laser-dentistry"],
    },
    {
      name: "Wisdom Tooth Extraction",
      slug: "wisdom-tooth-extraction",
      categorySlug: "general-dentistry",
      shortDescription: "Safe, comfortable removal with digital 3D planning.",
      technologies: ["digital-x-ray"],
    },
  ];

  const treatmentRecords: Record<string, string> = {};
  for (const [i, t] of treatments.entries()) {
    const rec = await prisma.treatment.upsert({
      where: { slug: t.slug },
      update: {},
      create: {
        name: t.name,
        slug: t.slug,
        categoryId: categoryRecords[t.categorySlug],
        shortDescription: t.shortDescription,
        fullDescription: `<p>${DEMO} ${t.shortDescription} Our team combines advanced technology with a gentle, patient-first approach to deliver results that look and feel completely natural.</p>`,
        benefits: [
          { title: "Long-lasting results", description: "Built with premium materials for durability.", icon: "shield-check" },
          { title: "Minimally invasive", description: "Modern techniques reduce discomfort and downtime.", icon: "sparkles" },
          { title: "Natural aesthetics", description: "Results that blend seamlessly with your smile.", icon: "smile" },
        ],
        procedureSteps: [
          { step: 1, title: "Consultation & Diagnostics", description: "Comprehensive exam with digital imaging." },
          { step: 2, title: "Personalized Treatment Plan", description: "A plan tailored to your goals and timeline." },
          { step: 3, title: "Treatment", description: "Performed by our specialists using the latest technology." },
          { step: 4, title: "Aftercare & Follow-up", description: "Ongoing support to ensure lasting results." },
        ],
        technologies: { connect: t.technologies.map((slug) => ({ id: techRecords[slug] })) },
        seoTitle: `${t.name} | Aurelia Dental Studio`,
        seoDescription: t.shortDescription,
        status: "PUBLISHED",
        order: i,
      },
    });
    treatmentRecords[t.slug] = rec.id;
  }

  // ── Doctor specializations ──────────────────────────────────────────
  const specializations = [
    { name: "Cosmetic Dentistry", slug: "cosmetic-dentistry-spec" },
    { name: "Oral & Maxillofacial Surgery", slug: "oral-maxillofacial-surgery" },
    { name: "Orthodontics", slug: "orthodontics-spec" },
    { name: "Pediatric Dentistry", slug: "pediatric-dentistry-spec" },
    { name: "Periodontics", slug: "periodontics" },
    { name: "Prosthodontics", slug: "prosthodontics" },
  ];
  const specRecords: Record<string, string> = {};
  for (const s of specializations) {
    const rec = await prisma.doctorSpecialization.upsert({
      where: { slug: s.slug },
      update: {},
      create: s,
    });
    specRecords[s.slug] = rec.id;
  }

  // ── Doctors ──────────────────────────────────────────────────────────
  const doctors = [
    { name: "Dr. Elena Marchetti", slug: "dr-elena-marchetti", designation: "Founder & Lead Cosmetic Dentist", spec: "cosmetic-dentistry-spec", years: 16, treatments: ["porcelain-veneers", "teeth-whitening", "gum-contouring"] },
    { name: "Dr. Samuel Okafor", slug: "dr-samuel-okafor", designation: "Oral & Maxillofacial Surgeon", spec: "oral-maxillofacial-surgery", years: 14, treatments: ["dental-implants", "wisdom-tooth-extraction", "full-mouth-rehabilitation"] },
    { name: "Dr. Priya Nandan", slug: "dr-priya-nandan", designation: "Orthodontist", spec: "orthodontics-spec", years: 11, treatments: ["invisalign-clear-aligners", "braces-orthodontics"] },
    { name: "Dr. Mateo Alvarez", slug: "dr-mateo-alvarez", designation: "Pediatric Dentist", spec: "pediatric-dentistry-spec", years: 9, treatments: ["pediatric-dental-care"] },
    { name: "Dr. Hana Kobayashi", slug: "dr-hana-kobayashi", designation: "Periodontist", spec: "periodontics", years: 13, treatments: ["gum-contouring", "dental-implants"] },
    { name: "Dr. Liam Fitzgerald", slug: "dr-liam-fitzgerald", designation: "Prosthodontist", spec: "prosthodontics", years: 18, treatments: ["same-day-crowns", "dental-bridges", "full-mouth-rehabilitation"] },
  ];

  const doctorRecords: Record<string, string> = {};
  for (const [i, d] of doctors.entries()) {
    const rec = await prisma.doctor.upsert({
      where: { slug: d.slug },
      update: {},
      create: {
        name: d.name,
        slug: d.slug,
        designation: d.designation,
        specializationId: specRecords[d.spec],
        qualification: "DDS, Advanced Fellowship",
        experienceYears: d.years,
        bio: `${DEMO} ${d.name} brings ${d.years} years of experience delivering precise, patient-centered dental care with a focus on long-term outcomes.`,
        languages: ["English", "Spanish"],
        registrationNumber: `DEN-${1000 + i}`,
        socialLinks: { linkedin: "https://linkedin.com", instagram: "https://instagram.com" },
        availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        availableTime: "9:00 AM – 6:00 PM",
        treatments: { create: d.treatments.map((slug) => ({ treatmentId: treatmentRecords[slug] })) },
        status: "PUBLISHED",
        order: i,
      },
    });
    doctorRecords[d.slug] = rec.id;
  }

  // ── Testimonials ─────────────────────────────────────────────────────
  const testimonialNames = [
    "Sarah Jennings", "Michael Chen", "Aisha Rahman", "Tom Becker",
    "Isabella Rossi", "David Park", "Grace Adeyemi", "Noah Bergström",
    "Camila Duarte", "Ethan Walsh",
  ];
  for (const [i, name] of testimonialNames.entries()) {
    await prisma.testimonial.upsert({
      where: { id: `seed-testimonial-${i}` },
      update: {},
      create: {
        id: `seed-testimonial-${i}`,
        patientName: name,
        rating: 5 - (i % 2),
        review: `${DEMO} The team made me feel completely at ease from the first consultation. The results exceeded what I imagined — professional, gentle and precise.`,
        treatmentId: treatmentRecords[treatments[i % treatments.length].slug],
        doctorId: doctorRecords[doctors[i % doctors.length].slug],
        featured: i < 4,
        status: "PUBLISHED",
        order: i,
      },
    });
  }

  // ── Smile Cases ──────────────────────────────────────────────────────
  const smileCaseCategories = ["Implants", "Smile Design", "Braces", "Whitening", "Veneers", "Full Mouth"];
  for (let i = 0; i < 8; i++) {
    const caseId = `SC-${String(i + 1).padStart(3, "0")}`;
    await prisma.smileCase.upsert({
      where: { caseId },
      update: {},
      create: {
        title: `${smileCaseCategories[i % smileCaseCategories.length]} Transformation`,
        caseId,
        beforeImage: "/demo/smile-before.jpg",
        afterImage: "/demo/smile-after.jpg",
        category: smileCaseCategories[i % smileCaseCategories.length],
        description: `${DEMO} A complete transformation achieved over a series of tailored appointments.`,
        order: i,
        status: "PUBLISHED",
      },
    });
  }

  // ── Clinic gallery ───────────────────────────────────────────────────
  const galleryCategories = [
    { name: "Reception", slug: "reception" },
    { name: "Treatment Rooms", slug: "treatment-rooms" },
    { name: "Our Team", slug: "our-team" },
    { name: "Equipment", slug: "equipment" },
  ];
  const galleryCatRecords: Record<string, string> = {};
  for (const [i, g] of galleryCategories.entries()) {
    const rec = await prisma.galleryCategory.upsert({
      where: { slug: g.slug },
      update: {},
      create: { ...g, order: i },
    });
    galleryCatRecords[g.slug] = rec.id;
  }
  for (let i = 0; i < 12; i++) {
    const cat = galleryCategories[i % galleryCategories.length];
    await prisma.gallery.upsert({
      where: { id: `seed-gallery-${i}` },
      update: {},
      create: {
        id: `seed-gallery-${i}`,
        title: `${cat.name} ${i + 1}`,
        image: "/demo/gallery-placeholder.jpg",
        categoryId: galleryCatRecords[cat.slug],
        order: i,
        status: "PUBLISHED",
      },
    });
  }

  // ── FAQs ─────────────────────────────────────────────────────────────
  const faqs = [
    { q: "Do you accept dental insurance?", a: "Yes, we work with most major PPO insurance plans and offer flexible financing options." },
    { q: "How often should I visit for a checkup?", a: "We recommend a checkup and professional cleaning every six months for most patients." },
    { q: "Is teeth whitening safe?", a: "Yes — our in-office whitening is dentist-supervised and safe for enamel when performed as directed." },
    { q: "Do you treat dental emergencies?", a: "We reserve same-day slots for urgent issues like severe pain, swelling or a knocked-out tooth." },
    { q: "How long do dental implants last?", a: "With proper care, dental implants can last 20+ years or even a lifetime." },
    { q: "Do you offer sedation dentistry?", a: "Yes, we offer nitrous oxide and oral sedation options for anxious patients." },
  ];
  for (const [i, f] of faqs.entries()) {
    await prisma.fAQ.upsert({
      where: { id: `seed-faq-${i}` },
      update: {},
      create: { id: `seed-faq-${i}`, question: f.q, answer: f.a, category: "general", order: i, status: "PUBLISHED" },
    });
  }

  // ── Blog categories, tags & posts ───────────────────────────────────
  const blogCategories = [
    { name: "Dental Health", slug: "dental-health" },
    { name: "Dental Implants", slug: "dental-implants-blog" },
    { name: "Oral Hygiene", slug: "oral-hygiene" },
    { name: "Cosmetic Dentistry", slug: "cosmetic-dentistry-blog" },
    { name: "Kids Dentistry", slug: "kids-dentistry" },
    { name: "Technology", slug: "technology-blog" },
  ];
  const blogCatRecords: Record<string, string> = {};
  for (const c of blogCategories) {
    const rec = await prisma.blogCategory.upsert({ where: { slug: c.slug }, update: {}, create: c });
    blogCatRecords[c.slug] = rec.id;
  }

  const blogTags = [
    { name: "Prevention", slug: "prevention" },
    { name: "Cosmetic", slug: "cosmetic" },
    { name: "Implants", slug: "implants-tag" },
    { name: "Kids", slug: "kids" },
    { name: "Technology", slug: "technology-tag" },
  ];
  const blogTagRecords: Record<string, string> = {};
  for (const t of blogTags) {
    const rec = await prisma.blogTag.upsert({ where: { slug: t.slug }, update: {}, create: t });
    blogTagRecords[t.slug] = rec.id;
  }

  const posts = [
    { title: "5 Signs You Might Need a Root Canal", slug: "signs-you-might-need-a-root-canal", cat: "dental-health", tags: ["prevention"] },
    { title: "The Complete Guide to Dental Implants", slug: "complete-guide-to-dental-implants", cat: "dental-implants-blog", tags: ["implants-tag"] },
    { title: "Veneers vs. Whitening: Which Is Right for You?", slug: "veneers-vs-whitening", cat: "cosmetic-dentistry-blog", tags: ["cosmetic"] },
    { title: "Building Healthy Brushing Habits in Kids", slug: "healthy-brushing-habits-kids", cat: "kids-dentistry", tags: ["kids", "prevention"] },
    { title: "How 3D Scanning Is Changing Modern Dentistry", slug: "3d-scanning-modern-dentistry", cat: "technology-blog", tags: ["technology-tag"] },
    { title: "Daily Oral Hygiene: What Actually Works", slug: "daily-oral-hygiene-what-works", cat: "oral-hygiene", tags: ["prevention"] },
  ];
  for (const [i, p] of posts.entries()) {
    await prisma.blogPost.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        title: p.title,
        slug: p.slug,
        excerpt: `${DEMO} A practical, easy-to-follow guide from our clinical team.`,
        content: `<p>${DEMO} This is placeholder article content. Replace it from the Admin → Blog editor.</p><h2>Why it matters</h2><p>Understanding this topic helps you make informed decisions about your oral health.</p>`,
        authorId: admin.id,
        categoryId: blogCatRecords[p.cat],
        tags: { connect: p.tags.map((slug) => ({ id: blogTagRecords[slug] })) },
        status: "PUBLISHED",
        publishedAt: new Date(Date.now() - i * 86400000 * 3),
        seoTitle: p.title,
        seoDescription: `${DEMO} ${p.title} — expert guidance from Aurelia Dental Studio.`,
      },
    });
  }

  // ── Homepage sections ────────────────────────────────────────────────
  const homePage = await prisma.page.upsert({
    where: { slug: "home" },
    update: {},
    create: {
      slug: "home",
      title: "Home",
      seoTitle: "Aurelia Dental Studio — Premium Dental Care",
      seoDescription: "Modern, premium dental care in the heart of the city.",
    },
  });

  const sections: {
    type: Parameters<typeof prisma.pageSection.create>[0]["data"]["type"];
    title?: string;
    subtitle?: string;
    content: Record<string, unknown>;
    order: number;
  }[] = [
    {
      type: "STATISTICS",
      order: 1,
      content: {
        items: [
          { label: "Years of Experience", value: 18, suffix: "+" },
          { label: "Happy Patients", value: 24000, suffix: "+" },
          { label: "Specialist Doctors", value: 6 },
          { label: "Treatments Completed", value: 42000, suffix: "+" },
        ],
      },
    },
    {
      type: "TEXT_IMAGE",
      title: "A Clinic Built Around Trust",
      subtitle: "About Us",
      order: 2,
      content: {
        body: `${DEMO} For nearly two decades, Aurelia Dental Studio has combined advanced technology with genuinely warm care. Every treatment plan starts with listening.`,
        image: "/demo/about-clinic.jpg",
        ctaText: "Learn About Us",
        ctaUrl: "/about",
        imagePosition: "right",
      },
    },
    { type: "TREATMENTS", title: "Comprehensive Care, Tailored to You", subtitle: "Treatments", order: 3, content: { limit: 6 } },
    { type: "THREE_D", title: "Explore the Anatomy of a Healthy Smile", subtitle: "Interactive", order: 4, content: { enabled: true, labels: ["Enamel", "Dentin", "Pulp", "Root"] } },
    { type: "DOCTORS", title: "Meet Our Specialists", subtitle: "Our Team", order: 5, content: { limit: 4 } },
    { type: "GALLERY", title: "Real Results, Real Confidence", subtitle: "Smile Gallery", order: 6, content: { limit: 6 } },
    { type: "TESTIMONIALS", title: "What Our Patients Say", subtitle: "Testimonials", order: 7, content: { limit: 6 } },
    { type: "BLOG", title: "From Our Journal", subtitle: "Blog", order: 8, content: { limit: 3 } },
    {
      type: "CTA",
      order: 9,
      content: {
        title: "Ready for Your Best Smile?",
        subtitle: "Book a consultation with our specialists today.",
        ctaText: "Book Appointment",
        ctaUrl: "/appointment",
      },
    },
  ];

  for (const s of sections) {
    const existing = await prisma.pageSection.findFirst({ where: { pageId: homePage.id, type: s.type } });
    if (!existing) {
      await prisma.pageSection.create({ data: { ...s, content: s.content as Prisma.InputJsonValue, pageId: homePage.id } });
    }
  }

  console.log("Seed complete.");
  console.log(`Super admin login → ${adminEmail} / ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
