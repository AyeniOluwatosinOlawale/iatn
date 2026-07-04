'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { GraduationCap, MapPin, Star, ChevronRight, BookOpen, ExternalLink, Search, Filter, X, CheckCircle } from 'lucide-react'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import DualVideoHero from '@/components/shared/DualVideoHero'

interface University {
  id: string
  name: string
  location: string
  country: string
  type: 'Federal' | 'Private' | 'State' | 'International'
  website: string
  accepts: string[]
  notable_programmes: string[]
  min_jamb: number | null
  jamb_competitive: string | null
  min_waec: number | null
  a_level_req: string | null
  a_level_by_subject: string | null
  sat_range: string | null
  igcse_req: string | null
  direct_entry: string | null
  rating: number
  review_count: number
  about: string
  logo: string
}

const UNIVERSITIES: University[] = [
  // ── NIGERIA — FEDERAL ──────────────────────────────────────────────────────
  {
    id: 'unilag', name: 'University of Lagos (UNILAG)', location: 'Lagos', country: 'Nigeria', type: 'Federal',
    website: 'https://unilag.edu.ng', accepts: ['jamb','waec','neco','a_level'],
    notable_programmes: ['Medicine','Law','Engineering','Business Admin','Computer Science','Pharmacy'],
    min_jamb: 200, jamb_competitive: 'Medicine/Law: 280+ · Engineering: 240+ · Sciences: 230+', min_waec: 5,
    a_level_req: '2 A-Level passes (Direct Entry to 200 Level)', a_level_by_subject: null,
    sat_range: null, igcse_req: '5 O-Level credits incl. English & Maths (IGCSE A*–C accepted)',
    direct_entry: 'A-Level: 2 passes in relevant subjects → Direct Entry into 200 Level, no JAMB required.',
    rating: 4.7, review_count: 1240,
    about: 'Nigeria\'s premier university and consistently top-ranked nationally. Strong across Medicine, Law, Engineering and Business. Located in the commercial capital of Africa.',
    logo: 'UL',
  },
  {
    id: 'ui', name: 'University of Ibadan (UI)', location: 'Ibadan, Oyo', country: 'Nigeria', type: 'Federal',
    website: 'https://www.ui.edu.ng', accepts: ['jamb','waec','neco','a_level'],
    notable_programmes: ['Medicine & Surgery','Pharmacy','Agriculture','Arts','Veterinary Medicine','Education'],
    min_jamb: 200, jamb_competitive: 'Medicine: 280+ · Sciences: 250+ · Arts: 220+', min_waec: 5,
    a_level_req: '2 A-Level passes (Direct Entry)', a_level_by_subject: null,
    sat_range: null, igcse_req: '5 O-Level credits incl. English & Maths',
    direct_entry: 'A-Level: 2 passes in relevant subjects for Direct Entry to 200 Level.',
    rating: 4.8, review_count: 980,
    about: 'Nigeria\'s first and oldest university (est. 1948). Renowned for research excellence and postgraduate programmes. College of Medicine is among Africa\'s most respected.',
    logo: 'UI',
  },
  {
    id: 'oau', name: 'Obafemi Awolowo University (OAU)', location: 'Ile-Ife, Osun', country: 'Nigeria', type: 'Federal',
    website: 'https://oauife.edu.ng', accepts: ['jamb','waec','neco','a_level'],
    notable_programmes: ['Medicine','Law','Engineering','Fine Arts','Architecture','Pharmacy'],
    min_jamb: 200, jamb_competitive: 'Medicine/Law: 280+ · Engineering: 240+ · Arts: 210+', min_waec: 5,
    a_level_req: '2 A-Level passes (Direct Entry)', a_level_by_subject: null,
    sat_range: null, igcse_req: '5 O-Level credits incl. English & Maths',
    direct_entry: 'A-Level: 2 passes in relevant subjects for Direct Entry.',
    rating: 4.5, review_count: 890,
    about: 'One of Nigeria\'s most prestigious universities (est. 1961) with a beautiful campus. Renowned for Medicine, Law, and Architecture.',
    logo: 'OAU',
  },
  {
    id: 'abu', name: 'Ahmadu Bello University (ABU)', location: 'Zaria, Kaduna', country: 'Nigeria', type: 'Federal',
    website: 'https://www.abu.edu.ng', accepts: ['jamb','waec','neco','a_level'],
    notable_programmes: ['Engineering','Medicine','Agriculture','Law','Sciences','Architecture'],
    min_jamb: 200, jamb_competitive: 'Medicine: 270+ · Engineering: 240+ · Sciences: 220+', min_waec: 5,
    a_level_req: '2 A-Level passes (Direct Entry)', a_level_by_subject: null,
    sat_range: null, igcse_req: '5 O-Level credits incl. English & Maths',
    direct_entry: 'A-Level: 2 passes relevant to course applied for.',
    rating: 4.4, review_count: 760,
    about: 'Nigeria\'s largest university by land area (est. 1962). Particularly strong in Engineering, Agriculture and Sciences. Located in the historic city of Zaria.',
    logo: 'ABU',
  },
  {
    id: 'unn', name: 'University of Nigeria, Nsukka (UNN)', location: 'Nsukka, Enugu', country: 'Nigeria', type: 'Federal',
    website: 'https://www.unn.edu.ng', accepts: ['jamb','waec','neco','a_level'],
    notable_programmes: ['Medicine','Law','Engineering','Pharmacy','Social Sciences','Education'],
    min_jamb: 200, jamb_competitive: 'Medicine/Law: 270+ · Engineering: 240+ · Sciences: 220+', min_waec: 5,
    a_level_req: '2 A-Level passes (Direct Entry)', a_level_by_subject: null,
    sat_range: null, igcse_req: '5 O-Level credits incl. English & Maths',
    direct_entry: 'A-Level: 2 passes for Direct Entry to 200 Level.',
    rating: 4.4, review_count: 820,
    about: 'First indigenous Nigerian university (est. 1960). Strong reputation for Medicine, Engineering and Social Sciences. Main campus in Nsukka, Enugu State.',
    logo: 'UNN',
  },
  {
    id: 'uniben', name: 'University of Benin (UNIBEN)', location: 'Benin City, Edo', country: 'Nigeria', type: 'Federal',
    website: 'https://www.uniben.edu.ng', accepts: ['jamb','waec','neco','a_level'],
    notable_programmes: ['Medicine & Surgery','Law','Engineering','Pharmacy','Mass Communication'],
    min_jamb: 200, jamb_competitive: 'Medicine/Law: 270+ · Engineering: 230+ · Arts: 210+', min_waec: 5,
    a_level_req: '2 A-Level passes (Direct Entry)', a_level_by_subject: null,
    sat_range: null, igcse_req: '5 O-Level credits incl. English & Maths',
    direct_entry: 'A-Level: 2 passes in subjects related to course of study.',
    rating: 4.4, review_count: 720,
    about: 'One of Nigeria\'s foremost universities. Renowned for its College of Medical Sciences and Faculty of Law. Strong in Medicine, Engineering and Law.',
    logo: 'UB',
  },
  {
    id: 'uniport', name: 'University of Port Harcourt (UNIPORT)', location: 'Port Harcourt, Rivers', country: 'Nigeria', type: 'Federal',
    website: 'https://www.uniport.edu.ng', accepts: ['jamb','waec','neco','a_level'],
    notable_programmes: ['Engineering (Petroleum)','Medicine','Law','Sciences','Social Sciences'],
    min_jamb: 200, jamb_competitive: 'Medicine: 260+ · Engineering: 230+', min_waec: 5,
    a_level_req: '2 A-Level passes (Direct Entry)', a_level_by_subject: null,
    sat_range: null, igcse_req: '5 O-Level credits incl. English & Maths',
    direct_entry: 'A-Level: 2 passes in relevant subjects.',
    rating: 4.3, review_count: 590,
    about: 'Known especially for Petroleum Engineering due to its location in Nigeria\'s oil region. Strong Sciences and Engineering faculties.',
    logo: 'UP',
  },
  {
    id: 'unical', name: 'University of Calabar (UNICAL)', location: 'Calabar, Cross River', country: 'Nigeria', type: 'Federal',
    website: 'https://www.unical.edu.ng', accepts: ['jamb','waec','neco','a_level'],
    notable_programmes: ['Medicine','Law','Sciences','Arts','Social Sciences','Education'],
    min_jamb: 200, jamb_competitive: 'Medicine: 260+ · Sciences: 220+', min_waec: 5,
    a_level_req: '2 A-Level passes (Direct Entry)', a_level_by_subject: null,
    sat_range: null, igcse_req: '5 O-Level credits incl. English & Maths',
    direct_entry: 'A-Level: 2 passes for Direct Entry.',
    rating: 4.2, review_count: 480,
    about: 'Located in the tourist city of Calabar. Known for Medicine, Law, and Social Sciences. Scenic campus with strong academic tradition.',
    logo: 'UC',
  },
  // ── NIGERIA — PRIVATE ─────────────────────────────────────────────────────
  {
    id: 'cu', name: 'Covenant University', location: 'Ota, Ogun State', country: 'Nigeria', type: 'Private',
    website: 'https://covenantuniversity.edu.ng', accepts: ['jamb','waec','neco','a_level'],
    notable_programmes: ['Engineering','Business Admin','Architecture','Computer Science','Accounting','Law'],
    min_jamb: 180, jamb_competitive: 'Engineering: 220+ · Sciences: 200+ · Management: 190+', min_waec: 5,
    a_level_req: '2 A-Level passes (Direct Entry)', a_level_by_subject: null,
    sat_range: null, igcse_req: '5 O-Level credits incl. English & Maths (IGCSE accepted)',
    direct_entry: 'A-Level: 2 passes in subjects relevant to the course applied for.',
    rating: 4.6, review_count: 870,
    about: 'Nigeria\'s top-ranked private university (Times Higher Education Africa Top Private). Known for discipline, ICT integration and strong graduate employment.',
    logo: 'CU',
  },
  {
    id: 'babcock', name: 'Babcock University', location: 'Ilishan-Remo, Ogun', country: 'Nigeria', type: 'Private',
    website: 'https://www.babcock.edu.ng', accepts: ['jamb','waec','neco','a_level'],
    notable_programmes: ['Medicine','Law','Business Admin','Computer Science','Nursing','Accounting'],
    min_jamb: 160, jamb_competitive: 'Medicine: 240+ · Sciences: 180+', min_waec: 5,
    a_level_req: '2 A-Level passes (Direct Entry)', a_level_by_subject: null,
    sat_range: null, igcse_req: '5 O-Level credits incl. English & Maths',
    direct_entry: 'A-Level: 2 passes in relevant subjects.',
    rating: 4.3, review_count: 640,
    about: 'Seventh-Day Adventist faith-based university with strong discipline and academic standards. Known for Medicine, Law, and Business. Beautiful Ilishan campus.',
    logo: 'BU',
  },
  {
    id: 'aun', name: 'American University of Nigeria (AUN)', location: 'Yola, Adamawa', country: 'Nigeria', type: 'Private',
    website: 'https://www.aun.edu.ng', accepts: ['jamb','waec','sat','a_level'],
    notable_programmes: ['Computer Science','Engineering','Business Admin','International Studies','Law'],
    min_jamb: 160, jamb_competitive: null, min_waec: 5,
    a_level_req: 'A-Level accepted for admission', a_level_by_subject: null,
    sat_range: '900+ (SAT accepted for admission)', igcse_req: 'IGCSE accepted',
    direct_entry: 'A-Level and SAT accepted for direct admission. American-style liberal arts curriculum.',
    rating: 4.4, review_count: 380,
    about: 'American-modelled liberal arts university in Yola. U.S.-accredited programmes, diverse faculty, and strong emphasis on technology and innovation.',
    logo: 'AUN',
  },
  {
    id: 'pau', name: 'Pan-Atlantic University (PAU)', location: 'Lagos', country: 'Nigeria', type: 'Private',
    website: 'https://pau.edu.ng', accepts: ['jamb','waec','a_level'],
    notable_programmes: ['Business Admin (LBS)','Computer Science','Engineering','Humanities'],
    min_jamb: 180, jamb_competitive: null, min_waec: 5,
    a_level_req: '2 A-Level passes', a_level_by_subject: null,
    sat_range: null, igcse_req: '5 O-Level credits incl. English & Maths',
    direct_entry: 'A-Level considered for Direct Entry.',
    rating: 4.4, review_count: 310,
    about: 'Home to the Lagos Business School (LBS), one of Africa\'s top MBA programmes. Strong governance, ethics and entrepreneurship ethos.',
    logo: 'PAU',
  },
  // ── UK — RUSSELL GROUP ────────────────────────────────────────────────────
  {
    id: 'oxford', name: 'University of Oxford', location: 'Oxford', country: 'United Kingdom', type: 'International',
    website: 'https://www.ox.ac.uk/admissions/undergraduate', accepts: ['a_level','igcse','ib'],
    notable_programmes: ['PPE','Medicine','Law','Computer Science','Mathematics','Engineering Science'],
    min_jamb: null, jamb_competitive: null, min_waec: null,
    a_level_req: 'A*AA minimum', a_level_by_subject: 'Medicine: A*AA (Chem+Bio/Maths/Physics) · CS: A*AA (Maths req.) · Engineering: A*AA · Law: AAA',
    sat_range: null, igcse_req: 'Strong IGCSEs expected — mostly A*/A. Min 5 at grade 4/C.',
    direct_entry: null, rating: 5.0, review_count: 4120,
    about: 'World\'s second oldest English-speaking university. Consistently top 5 globally (QS). ~1 in 5 applicants receive an offer. Accepts Cambridge A-Level and IB.',
    logo: 'OX',
  },
  {
    id: 'cambridge', name: 'University of Cambridge', location: 'Cambridge', country: 'United Kingdom', type: 'International',
    website: 'https://www.undergraduate.study.cam.ac.uk', accepts: ['a_level','igcse','ib'],
    notable_programmes: ['Engineering','Natural Sciences','Mathematics','Law','Computer Science','Medicine'],
    min_jamb: null, jamb_competitive: null, min_waec: null,
    a_level_req: 'A*AA minimum', a_level_by_subject: 'Engineering/Maths/CS: A*A*A · Natural Sciences: A*AA · Medicine: A*AA · Law: A*AA',
    sat_range: null, igcse_req: 'Strong IGCSEs — mostly A*/A (8/9) in relevant subjects.',
    direct_entry: null, rating: 5.0, review_count: 3890,
    about: 'Ranked #1 globally (QS 2024). Exceptional STEM and Humanities programmes. ~1 in 5 applicants receive an offer. Top choice for Nigerian A-Level students.',
    logo: 'CAM',
  },
  {
    id: 'imperial', name: 'Imperial College London', location: 'London', country: 'United Kingdom', type: 'International',
    website: 'https://www.imperial.ac.uk/study/apply/undergraduate/', accepts: ['a_level','edexcel','ib'],
    notable_programmes: ['Medicine (MBBS)','Engineering','Computing','Physics','Mathematics','Business (MBA)'],
    min_jamb: null, jamb_competitive: null, min_waec: null,
    a_level_req: 'AAA–A*AA', a_level_by_subject: 'Medicine: A*AA (Chem req.) · Engineering: A*AA (Maths+Physics) · Computing: A*AA (Maths req.)',
    sat_range: null, igcse_req: 'A*/A in relevant IGCSE subjects. English & Maths required.',
    direct_entry: null, rating: 4.9, review_count: 2760,
    about: 'Top 10 global university specialising in science, engineering, medicine and business. #2 in UK (QS). Graduates among world\'s most employable.',
    logo: 'ICL',
  },
  {
    id: 'ucl', name: 'University College London (UCL)', location: 'London', country: 'United Kingdom', type: 'International',
    website: 'https://www.ucl.ac.uk/prospective-students/undergraduate', accepts: ['a_level','igcse','ib'],
    notable_programmes: ['Medicine','Law','Engineering','Architecture','Economics','Computer Science'],
    min_jamb: null, jamb_competitive: null, min_waec: null,
    a_level_req: 'AAB–A*AA depending on course', a_level_by_subject: 'Medicine: A*AA · Law: AAA · Engineering: AAA · Economics: AAB',
    sat_range: null, igcse_req: 'Strong IGCSEs required. English & Maths at grade C/4 minimum.',
    direct_entry: null, rating: 4.9, review_count: 2540,
    about: 'London\'s leading multidisciplinary university. QS Top 10 globally. Exceptional research across all disciplines. Central London location.',
    logo: 'UCL',
  },
  {
    id: 'lse', name: 'London School of Economics (LSE)', location: 'London', country: 'United Kingdom', type: 'International',
    website: 'https://www.lse.ac.uk/study-at-lse/undergraduate', accepts: ['a_level','igcse','ib'],
    notable_programmes: ['Economics','Law','Political Science','Sociology','Finance','Management'],
    min_jamb: null, jamb_competitive: null, min_waec: null,
    a_level_req: 'AAA minimum', a_level_by_subject: 'Economics/Finance: AAA (Maths req.) · Law: AAA · Management: AAA',
    sat_range: null, igcse_req: 'Strong IGCSEs including Maths at A*/A. English required.',
    direct_entry: null, rating: 4.9, review_count: 1980,
    about: 'The world\'s leading social science university. Exceptional for Economics, Law, Politics and Finance. Alumni include 18 world leaders and 37 Nobel Prize winners.',
    logo: 'LSE',
  },
  {
    id: 'kcl', name: "King's College London (KCL)", location: 'London', country: 'United Kingdom', type: 'International',
    website: 'https://www.kcl.ac.uk/study/undergraduate', accepts: ['a_level','igcse','ib'],
    notable_programmes: ['Medicine (MBBS)','Law','Nursing','Dentistry','English','War Studies'],
    min_jamb: null, jamb_competitive: null, min_waec: null,
    a_level_req: 'ABB–A*AA', a_level_by_subject: 'Medicine: A*AA (Chem+Bio) · Law: AAA · Dentistry: AAA',
    sat_range: null, igcse_req: 'IGCSE English & Maths at C/4 minimum. Science subjects recommended.',
    direct_entry: null, rating: 4.7, review_count: 1760,
    about: 'One of the oldest and largest London universities (est. 1829). Particularly strong in Medicine, Law, and Nursing. Four Thames riverside campuses.',
    logo: 'KCL',
  },
  {
    id: 'edinburgh', name: 'University of Edinburgh', location: 'Edinburgh, Scotland', country: 'United Kingdom', type: 'International',
    website: 'https://www.ed.ac.uk/studying/undergraduate', accepts: ['a_level','igcse','ib'],
    notable_programmes: ['Medicine','Law','Computer Science','Engineering','Veterinary Medicine','Business'],
    min_jamb: null, jamb_competitive: null, min_waec: null,
    a_level_req: 'ABB–AAA', a_level_by_subject: 'Medicine: AAA (Chem+Bio) · CS: AAB (Maths) · Engineering: ABB–AAB · Law: AAB',
    sat_range: null, igcse_req: 'IGCSE English required. Grades A*–C in relevant subjects.',
    direct_entry: null, rating: 4.7, review_count: 1640,
    about: 'One of the world\'s top 30 universities (est. 1583). A Russell Group university popular with Nigerian students. Strong Medicine, Law and Computing.',
    logo: 'ED',
  },
  {
    id: 'strathclyde', name: 'University of Strathclyde', location: 'Glasgow, Scotland', country: 'United Kingdom', type: 'International',
    website: 'https://www.strath.ac.uk/studywithus/undergraduate/', accepts: ['a_level','igcse','ib'],
    notable_programmes: ['Engineering','Business (Strathclyde Business School)','Pharmacy','Law','Computer Science','Architecture'],
    min_jamb: null, jamb_competitive: null, min_waec: null,
    a_level_req: 'BBB–AAA', a_level_by_subject: 'Engineering: BBB–ABB (Maths+Physics req.) · Pharmacy: ABB · Business: BBB · Law: BBB',
    sat_range: null, igcse_req: 'IGCSE English & Maths at C/4. Science IGCSEs beneficial.',
    direct_entry: null, rating: 4.5, review_count: 980,
    about: 'Scotland\'s third largest university and a leading research institution. "Place of Useful Learning." Strathclyde Business School is triple-accredited. Popular with Nigerian engineers.',
    logo: 'STR',
  },
  {
    id: 'glasgow', name: 'University of Glasgow', location: 'Glasgow, Scotland', country: 'United Kingdom', type: 'International',
    website: 'https://www.gla.ac.uk/undergraduate/', accepts: ['a_level','igcse','ib'],
    notable_programmes: ['Medicine','Law','Engineering','Economics','Computer Science','Dentistry'],
    min_jamb: null, jamb_competitive: null, min_waec: null,
    a_level_req: 'BBB–AAB', a_level_by_subject: 'Medicine: AAA (Chem+Bio) · Law: ABB · Engineering: ABB · CS: BBB',
    sat_range: null, igcse_req: 'IGCSE English & Maths required. C/4 minimum.',
    direct_entry: null, rating: 4.6, review_count: 1120,
    about: 'One of the world\'s top 100 universities (est. 1451). Russell Group member with strong Medicine, Law and Engineering. Home to Adam Smith.',
    logo: 'GLA',
  },
  {
    id: 'manchester', name: 'University of Manchester', location: 'Manchester', country: 'United Kingdom', type: 'International',
    website: 'https://www.manchester.ac.uk/study/undergraduate/', accepts: ['a_level','igcse','ib'],
    notable_programmes: ['Medicine','Engineering','Computer Science','Business','Physics','Economics'],
    min_jamb: null, jamb_competitive: null, min_waec: null,
    a_level_req: 'ABB–AAA', a_level_by_subject: 'Medicine: AAA (Chem+Bio) · CS: AAA (Maths) · Engineering: ABB–AAA · Business: ABB',
    sat_range: null, igcse_req: 'IGCSE English & Maths C/4. IELTS 6.5+ required.',
    direct_entry: null, rating: 4.6, review_count: 1420,
    about: 'One of the UK\'s largest research universities (est. 1824). Russell Group. 25 Nobel Prize winners. One of the most popular UK destinations for Nigerian students.',
    logo: 'MAN',
  },
  {
    id: 'birmingham', name: 'University of Birmingham', location: 'Birmingham', country: 'United Kingdom', type: 'International',
    website: 'https://www.birmingham.ac.uk/undergraduate/', accepts: ['a_level','igcse','ib'],
    notable_programmes: ['Medicine','Law','Engineering','Business','Computer Science','Dentistry'],
    min_jamb: null, jamb_competitive: null, min_waec: null,
    a_level_req: 'ABB–AAA', a_level_by_subject: 'Medicine: AAA · Law: ABB · Engineering: ABB · Business: ABB',
    sat_range: null, igcse_req: 'IGCSE English & Maths C/4 minimum.',
    direct_entry: null, rating: 4.5, review_count: 1180,
    about: 'Russell Group university (est. 1900) with a beautiful Edgbaston campus. Particularly strong in Medicine, Law, Engineering and Business.',
    logo: 'BHAM',
  },
  {
    id: 'bristol', name: 'University of Bristol', location: 'Bristol', country: 'United Kingdom', type: 'International',
    website: 'https://www.bristol.ac.uk/study/undergraduate/', accepts: ['a_level','igcse','ib'],
    notable_programmes: ['Medicine','Law','Engineering','Computer Science','Economics','Veterinary Science'],
    min_jamb: null, jamb_competitive: null, min_waec: null,
    a_level_req: 'ABB–A*AA', a_level_by_subject: 'Medicine: A*AA · Law: AAA · Engineering: AAA · CS: AAA (Maths)',
    sat_range: null, igcse_req: 'IGCSE English & Maths C/4. Science subjects useful.',
    direct_entry: null, rating: 4.7, review_count: 1340,
    about: 'Russell Group university ranked in the global top 60. Consistently high student satisfaction. Strong research in STEM and Humanities.',
    logo: 'BRS',
  },
  {
    id: 'leeds', name: 'University of Leeds', location: 'Leeds', country: 'United Kingdom', type: 'International',
    website: 'https://courses.leeds.ac.uk/undergraduate', accepts: ['a_level','igcse','ib'],
    notable_programmes: ['Medicine','Law','Engineering','Business (Leeds UB)','Computer Science','Architecture'],
    min_jamb: null, jamb_competitive: null, min_waec: null,
    a_level_req: 'BBB–AAA', a_level_by_subject: 'Medicine: AAA · Law: ABB · Engineering: BBB · Business: ABB',
    sat_range: null, igcse_req: 'IGCSE English & Maths at C/4 required.',
    direct_entry: null, rating: 4.5, review_count: 1260,
    about: 'Russell Group university in one of the UK\'s top student cities. Large international community and strong research output. Popular with Nigerian students.',
    logo: 'LDS',
  },
  {
    id: 'sheffield', name: 'University of Sheffield', location: 'Sheffield', country: 'United Kingdom', type: 'International',
    website: 'https://www.sheffield.ac.uk/undergraduate/', accepts: ['a_level','igcse','ib'],
    notable_programmes: ['Engineering','Medicine','Computer Science','Business','Architecture','Chemistry'],
    min_jamb: null, jamb_competitive: null, min_waec: null,
    a_level_req: 'BBB–AAA', a_level_by_subject: 'Engineering: ABB (Maths) · Medicine: AAA · CS: ABB (Maths) · Business: ABB',
    sat_range: null, igcse_req: 'IGCSE English & Maths C/4.',
    direct_entry: null, rating: 4.5, review_count: 1090,
    about: 'Russell Group. Voted #1 Students\' Union in the UK multiple times. Known for Engineering, Medicine and Architecture.',
    logo: 'SHEF',
  },
  {
    id: 'nottingham', name: 'University of Nottingham', location: 'Nottingham', country: 'United Kingdom', type: 'International',
    website: 'https://www.nottingham.ac.uk/ugstudy/', accepts: ['a_level','igcse','ib'],
    notable_programmes: ['Medicine','Pharmacy','Law','Engineering','Business','Computer Science'],
    min_jamb: null, jamb_competitive: null, min_waec: null,
    a_level_req: 'ABB–AAA', a_level_by_subject: 'Medicine: AAA · Pharmacy: AAB · Law: AAB · Engineering: ABB',
    sat_range: null, igcse_req: 'IGCSE English & Maths C/4.',
    direct_entry: null, rating: 4.5, review_count: 1040,
    about: 'Russell Group with beautiful campus. Strong in Pharmacy, Medicine and Engineering. Campuses also in Malaysia and China.',
    logo: 'NOTT',
  },
  {
    id: 'warwick', name: 'University of Warwick', location: 'Coventry', country: 'United Kingdom', type: 'International',
    website: 'https://warwick.ac.uk/study/undergraduate/', accepts: ['a_level','igcse','ib'],
    notable_programmes: ['Economics','Mathematics','Computer Science','Engineering','Business (WBS)','Law'],
    min_jamb: null, jamb_competitive: null, min_waec: null,
    a_level_req: 'AAA–A*AA', a_level_by_subject: 'Maths: A*AA · CS: AAA · Economics: AAA · Engineering: AAA · WBS: AAA',
    sat_range: null, igcse_req: 'IGCSE Maths A*/A recommended. English C/4 required.',
    direct_entry: null, rating: 4.8, review_count: 1560,
    about: 'Top 10 UK university known for exceptional Economics, Mathematics and Computer Science. Warwick Business School is triple-accredited.',
    logo: 'WAR',
  },
  {
    id: 'durham', name: 'Durham University', location: 'Durham', country: 'United Kingdom', type: 'International',
    website: 'https://www.durham.ac.uk/study/undergraduate/', accepts: ['a_level','igcse','ib'],
    notable_programmes: ['Law','Business','Economics','Engineering','Computer Science','Natural Sciences'],
    min_jamb: null, jamb_competitive: null, min_waec: null,
    a_level_req: 'ABB–A*AA', a_level_by_subject: 'Law: AAA · Business: AAA · Economics: AAB · Engineering: ABB',
    sat_range: null, igcse_req: 'IGCSE English & Maths C/4.',
    direct_entry: null, rating: 4.6, review_count: 980,
    about: 'Collegiate Russell Group university (est. 1832) with a historic cathedral city setting. Strong Law, Business and Humanities. Growing rapidly in rankings.',
    logo: 'DUR',
  },
  {
    id: 'southampton', name: 'University of Southampton', location: 'Southampton', country: 'United Kingdom', type: 'International',
    website: 'https://www.southampton.ac.uk/study/undergraduate/', accepts: ['a_level','igcse','ib'],
    notable_programmes: ['Engineering','Computer Science','Law','Medicine','Economics','Oceanography'],
    min_jamb: null, jamb_competitive: null, min_waec: null,
    a_level_req: 'BBB–AAA', a_level_by_subject: 'Engineering: ABB (Maths+Physics) · CS: ABB (Maths) · Law: AAB · Medicine: AAA',
    sat_range: null, igcse_req: 'IGCSE English & Maths C/4.',
    direct_entry: null, rating: 4.5, review_count: 880,
    about: 'Russell Group known for Electronics, Engineering and Oceanography research. Strong Computer Science and Law departments.',
    logo: 'SOTN',
  },
  {
    id: 'bath', name: 'University of Bath', location: 'Bath', country: 'United Kingdom', type: 'International',
    website: 'https://www.bath.ac.uk/topics/undergraduate-study/', accepts: ['a_level','igcse','ib'],
    notable_programmes: ['Engineering','Business (School of Management)','Computer Science','Architecture','Chemistry'],
    min_jamb: null, jamb_competitive: null, min_waec: null,
    a_level_req: 'ABB–A*AA', a_level_by_subject: 'Engineering: AAB (Maths req.) · Business: AAA · CS: AAB (Maths)',
    sat_range: null, igcse_req: 'IGCSE English & Maths C/4. Maths A*/A recommended.',
    direct_entry: null, rating: 4.7, review_count: 1020,
    about: 'Consistently ranked top 10 in UK. Exceptional for Engineering, Business and Architecture. Strong placement year (industry year) culture.',
    logo: 'BATH',
  },
  {
    id: 'exeter', name: 'University of Exeter', location: 'Exeter', country: 'United Kingdom', type: 'International',
    website: 'https://www.exeter.ac.uk/study/undergraduate/', accepts: ['a_level','igcse','ib'],
    notable_programmes: ['Business','Law','Medicine','Engineering','Computer Science','Climate Science'],
    min_jamb: null, jamb_competitive: null, min_waec: null,
    a_level_req: 'BBB–A*AA', a_level_by_subject: 'Medicine: A*AA · Law: AAB · Business: ABB · Engineering: ABB',
    sat_range: null, igcse_req: 'IGCSE English & Maths C/4.',
    direct_entry: null, rating: 4.5, review_count: 820,
    about: 'Russell Group in beautiful Devon. Strong in Business, Medicine and Climate Science. One of the fastest-rising UK universities.',
    logo: 'EXE',
  },
  {
    id: 'cardiff', name: 'Cardiff University', location: 'Cardiff, Wales', country: 'United Kingdom', type: 'International',
    website: 'https://www.cardiff.ac.uk/study/undergraduate/', accepts: ['a_level','igcse','ib'],
    notable_programmes: ['Medicine','Dentistry','Law','Engineering','Pharmacy','Architecture'],
    min_jamb: null, jamb_competitive: null, min_waec: null,
    a_level_req: 'BBB–AAA', a_level_by_subject: 'Medicine: AAA · Dentistry: AAA · Law: ABB · Engineering: ABB',
    sat_range: null, igcse_req: 'IGCSE English & Maths C/4.',
    direct_entry: null, rating: 4.4, review_count: 760,
    about: 'Wales\'s leading Russell Group university. Particularly strong in Medicine, Dentistry and Law. Vibrant capital city campus.',
    logo: 'CDFF',
  },
  {
    id: 'qmul', name: 'Queen Mary University of London', location: 'London', country: 'United Kingdom', type: 'International',
    website: 'https://www.qmul.ac.uk/undergraduate/', accepts: ['a_level','igcse','ib'],
    notable_programmes: ['Medicine (MBBS)','Law','Engineering','Computer Science','Economics','Dentistry'],
    min_jamb: null, jamb_competitive: null, min_waec: null,
    a_level_req: 'BBB–A*AA', a_level_by_subject: 'Medicine: A*AA · Law: AAB · Engineering: ABB · CS: ABB',
    sat_range: null, igcse_req: 'IGCSE English & Maths C/4.',
    direct_entry: null, rating: 4.5, review_count: 840,
    about: 'Russell Group university in the heart of East London. Strong Medicine, Law and Engineering. Known for diversity and London living.',
    logo: 'QMUL',
  },
  {
    id: 'liverpool', name: 'University of Liverpool', location: 'Liverpool', country: 'United Kingdom', type: 'International',
    website: 'https://www.liverpool.ac.uk/study/undergraduate/', accepts: ['a_level','igcse','ib'],
    notable_programmes: ['Medicine','Dentistry','Law','Engineering','Architecture','Computer Science'],
    min_jamb: null, jamb_competitive: null, min_waec: null,
    a_level_req: 'BBB–AAA', a_level_by_subject: 'Medicine: AAA · Dentistry: AAA · Law: ABB · Engineering: ABB',
    sat_range: null, igcse_req: 'IGCSE English & Maths C/4.',
    direct_entry: null, rating: 4.4, review_count: 870,
    about: 'Russell Group university in the iconic city of Liverpool. Strong Medicine, Dentistry and Architecture programmes.',
    logo: 'LIV',
  },
  {
    id: 'newcastle', name: 'Newcastle University', location: 'Newcastle upon Tyne', country: 'United Kingdom', type: 'International',
    website: 'https://www.ncl.ac.uk/undergraduate/', accepts: ['a_level','igcse','ib'],
    notable_programmes: ['Medicine','Dentistry','Law','Engineering','Computer Science','Marine Science'],
    min_jamb: null, jamb_competitive: null, min_waec: null,
    a_level_req: 'BBB–AAA', a_level_by_subject: 'Medicine: AAA · Dentistry: AAA · Law: ABB · Engineering: ABB',
    sat_range: null, igcse_req: 'IGCSE English & Maths C/4.',
    direct_entry: null, rating: 4.4, review_count: 790,
    about: 'Russell Group university. Strong Medicine, Dentistry and Engineering. Vibrant student city with lower cost of living than London.',
    logo: 'NCL',
  },
  {
    id: 'qub', name: "Queen's University Belfast (QUB)", location: 'Belfast, Northern Ireland', country: 'United Kingdom', type: 'International',
    website: 'https://www.qub.ac.uk/Study/', accepts: ['a_level','igcse','ib'],
    notable_programmes: ['Medicine','Law','Engineering','Pharmacy','Computer Science','Business'],
    min_jamb: null, jamb_competitive: null, min_waec: null,
    a_level_req: 'BBB–AAA', a_level_by_subject: 'Medicine: AAA · Pharmacy: ABB · Law: ABB · Engineering: ABB',
    sat_range: null, igcse_req: 'IGCSE English & Maths C/4.',
    direct_entry: null, rating: 4.4, review_count: 680,
    about: 'Russell Group university in Belfast. One of the most affordable Russell Group universities. Strong Medicine, Pharmacy and Law.',
    logo: 'QUB',
  },
  {
    id: 'coventry', name: 'Coventry University', location: 'Coventry', country: 'United Kingdom', type: 'International',
    website: 'https://www.coventry.ac.uk/course-structure/undergraduate/', accepts: ['a_level','igcse','ib'],
    notable_programmes: ['Engineering','Business','Computer Science','Nursing','Architecture','Law'],
    min_jamb: null, jamb_competitive: null, min_waec: null,
    a_level_req: 'CCC–AAB', a_level_by_subject: 'Engineering: BCC · Business: BCC · CS: BCC',
    sat_range: null, igcse_req: 'IGCSE English C/4 required.',
    direct_entry: null, rating: 4.1, review_count: 620,
    about: 'One of the UK\'s most popular universities for international students. Strong Engineering, Business and Nursing programmes. Lower entry requirements than Russell Group.',
    logo: 'COV',
  },
  // ── USA ───────────────────────────────────────────────────────────────────
  {
    id: 'harvard', name: 'Harvard University', location: 'Cambridge, Massachusetts', country: 'United States', type: 'International',
    website: 'https://college.harvard.edu/admissions', accepts: ['sat','act','a_level','ib'],
    notable_programmes: ['Law (JD)','Business (MBA)','Medicine (MD)','Government','Computer Science','Economics'],
    min_jamb: null, jamb_competitive: null, min_waec: null,
    a_level_req: 'A*A*A or equivalent (no fixed minimum — holistic review)', a_level_by_subject: null,
    sat_range: '1460–1580 (middle 50%). ACT: 33–36.', igcse_req: 'Strong IGCSEs expected — A*/A in most subjects.',
    direct_entry: null, rating: 5.0, review_count: 5100,
    about: 'World\'s most famous university (est. 1636). Acceptance rate ~3.4%. Generous financial aid for international students. Holistic admissions — no fixed grade cutoff.',
    logo: 'HU',
  },
  {
    id: 'mit', name: 'Massachusetts Institute of Technology (MIT)', location: 'Cambridge, Massachusetts', country: 'United States', type: 'International',
    website: 'https://mitadmissions.org/apply/freshman/', accepts: ['sat','act','a_level','ib'],
    notable_programmes: ['Engineering','Computer Science','Physics','Mathematics','Economics','Architecture'],
    min_jamb: null, jamb_competitive: null, min_waec: null,
    a_level_req: 'A*A*A or equivalent', a_level_by_subject: null,
    sat_range: '1510–1580 (middle 50%). ACT: 34–36.', igcse_req: 'Strong IGCSEs — A*/A in Maths and Sciences.',
    direct_entry: null, rating: 5.0, review_count: 3240,
    about: '#1 global university for Engineering and Technology (QS). Acceptance rate ~3.9%. Focus on innovation and problem-solving.',
    logo: 'MIT',
  },
  {
    id: 'stanford', name: 'Stanford University', location: 'Stanford, California', country: 'United States', type: 'International',
    website: 'https://admission.stanford.edu/apply/', accepts: ['sat','act','a_level','ib'],
    notable_programmes: ['Computer Science','Engineering','Business (MBA)','Medicine','Law','Economics'],
    min_jamb: null, jamb_competitive: null, min_waec: null,
    a_level_req: 'A*A*A or equivalent', a_level_by_subject: null,
    sat_range: '1500–1570 (middle 50%). ACT: 34–36.', igcse_req: 'Exceptional IGCSEs expected — A*/A throughout.',
    direct_entry: null, rating: 5.0, review_count: 4870,
    about: 'Heart of Silicon Valley. #3 globally (QS). Known for Computer Science, Engineering and Entrepreneurship. Acceptance rate ~3.7%.',
    logo: 'SU',
  },
  {
    id: 'yale', name: 'Yale University', location: 'New Haven, Connecticut', country: 'United States', type: 'International',
    website: 'https://admissions.yale.edu/', accepts: ['sat','act','a_level','ib'],
    notable_programmes: ['Law','Medicine','Political Science','Economics','History','Drama'],
    min_jamb: null, jamb_competitive: null, min_waec: null,
    a_level_req: 'A*A*A or equivalent', a_level_by_subject: null,
    sat_range: '1470–1570. ACT: 33–35.', igcse_req: 'Exceptional IGCSEs — A*/A strongly expected.',
    direct_entry: null, rating: 5.0, review_count: 2980,
    about: 'Ivy League (est. 1701). Exceptional for Law, Medicine and Political Science. Yale Law School is the #1 law school in the USA.',
    logo: 'YU',
  },
  {
    id: 'princeton', name: 'Princeton University', location: 'Princeton, New Jersey', country: 'United States', type: 'International',
    website: 'https://admission.princeton.edu/', accepts: ['sat','act','a_level','ib'],
    notable_programmes: ['Mathematics','Physics','Engineering','Politics','Economics','Computer Science'],
    min_jamb: null, jamb_competitive: null, min_waec: null,
    a_level_req: 'A*A*A or equivalent', a_level_by_subject: null,
    sat_range: '1500–1570. ACT: 34–36.', igcse_req: 'Exceptional IGCSEs — A*/A throughout.',
    direct_entry: null, rating: 5.0, review_count: 2640,
    about: 'Ivy League known for Mathematics, Physics and Politics. No graduate schools for Law or Medicine — strong undergraduate focus. Acceptance ~3.5%.',
    logo: 'PU',
  },
  {
    id: 'columbia', name: 'Columbia University', location: 'New York City, New York', country: 'United States', type: 'International',
    website: 'https://undergrad.admissions.columbia.edu/', accepts: ['sat','act','a_level','ib'],
    notable_programmes: ['Journalism','Law','Medicine','Engineering','Business','Political Science'],
    min_jamb: null, jamb_competitive: null, min_waec: null,
    a_level_req: 'A*A*A or equivalent', a_level_by_subject: null,
    sat_range: '1500–1570. ACT: 34–36.', igcse_req: 'Exceptional IGCSEs — A*/A in most subjects.',
    direct_entry: null, rating: 5.0, review_count: 2750,
    about: 'Ivy League in the heart of Manhattan. Columbia Journalism School is the most prestigious in the world. Strong in Law, Medicine and Business.',
    logo: 'COL',
  },
  {
    id: 'cornell', name: 'Cornell University', location: 'Ithaca, New York', country: 'United States', type: 'International',
    website: 'https://admissions.cornell.edu/', accepts: ['sat','act','a_level','ib'],
    notable_programmes: ['Engineering','Hotel Administration','Architecture','Medicine','Law','Computer Science'],
    min_jamb: null, jamb_competitive: null, min_waec: null,
    a_level_req: 'A*AA–A*A*A', a_level_by_subject: null,
    sat_range: '1450–1560. ACT: 33–35.', igcse_req: 'Strong IGCSEs — A*/A in relevant subjects.',
    direct_entry: null, rating: 4.9, review_count: 2340,
    about: 'Ivy League with diverse programmes including Hotel Administration and Veterinary Medicine. Known for Engineering, CS and Architecture.',
    logo: 'CU2',
  },
  {
    id: 'upenn', name: 'University of Pennsylvania', location: 'Philadelphia, Pennsylvania', country: 'United States', type: 'International',
    website: 'https://admissions.upenn.edu/', accepts: ['sat','act','a_level','ib'],
    notable_programmes: ['Business (Wharton)','Medicine (Perelman)','Law','Engineering','Nursing'],
    min_jamb: null, jamb_competitive: null, min_waec: null,
    a_level_req: 'A*A*A or equivalent', a_level_by_subject: null,
    sat_range: '1490–1570. ACT: 34–36.', igcse_req: 'Exceptional IGCSEs — A*/A in most subjects.',
    direct_entry: null, rating: 4.9, review_count: 2180,
    about: 'Ivy League home to the Wharton School — the world\'s most prestigious undergraduate business programme.',
    logo: 'PEN',
  },
  {
    id: 'nyu', name: 'New York University (NYU)', location: 'New York City, New York', country: 'United States', type: 'International',
    website: 'https://www.nyu.edu/admissions/undergraduate-admissions.html', accepts: ['sat','act','a_level','ib'],
    notable_programmes: ['Business (Stern)','Law','Medicine','Film/Arts (Tisch)','Computer Science','Economics'],
    min_jamb: null, jamb_competitive: null, min_waec: null,
    a_level_req: 'AAA–A*AA', a_level_by_subject: null,
    sat_range: '1350–1530. ACT: 31–34.', igcse_req: 'Strong IGCSEs — A*/A in most subjects.',
    direct_entry: null, rating: 4.7, review_count: 2060,
    about: 'One of the most global universities, with campuses in NYC, Abu Dhabi, and Shanghai. Strong for Business, Law, Film/Arts and Computer Science.',
    logo: 'NYU',
  },
  {
    id: 'ucberkeley', name: 'UC Berkeley', location: 'Berkeley, California', country: 'United States', type: 'International',
    website: 'https://admissions.berkeley.edu/', accepts: ['sat','act','a_level','ib'],
    notable_programmes: ['Computer Science','Engineering','Business (Haas)','Law','Economics','Public Health'],
    min_jamb: null, jamb_competitive: null, min_waec: null,
    a_level_req: 'AAA–A*AA', a_level_by_subject: null,
    sat_range: '1310–1530. ACT: 29–35.', igcse_req: 'Strong IGCSEs — A*/A in relevant subjects.',
    direct_entry: null, rating: 4.8, review_count: 3120,
    about: 'Top public university in the world. Famous for Computer Science, Engineering and Public Policy. Silicon Valley connections.',
    logo: 'UCB',
  },
  // ── CANADA ───────────────────────────────────────────────────────────────
  {
    id: 'utoronto', name: 'University of Toronto', location: 'Toronto, Ontario', country: 'Canada', type: 'International',
    website: 'https://future.utoronto.ca/apply/requirements/', accepts: ['a_level','igcse','ib','sat'],
    notable_programmes: ['Computer Science','Engineering','Business (Rotman)','Medicine','Life Sciences','Arts & Science'],
    min_jamb: null, jamb_competitive: null, min_waec: null,
    a_level_req: 'ABB minimum', a_level_by_subject: 'CS/Engineering: ABB (Maths req.) · Business: BBB · Sciences: ABB',
    sat_range: '1260–1500.', igcse_req: '6 IGCSEs required incl. English & Maths at C/4.',
    direct_entry: null, rating: 4.8, review_count: 1980,
    about: 'Canada\'s #1 university (QS Top 25). Popular with Nigerian students seeking North American education. Three Toronto campuses.',
    logo: 'UT',
  },
  {
    id: 'mcgill', name: 'McGill University', location: 'Montreal, Quebec', country: 'Canada', type: 'International',
    website: 'https://www.mcgill.ca/undergraduate-admissions/', accepts: ['a_level','igcse','ib','sat'],
    notable_programmes: ['Medicine','Law','Engineering','Computer Science','Business (Desautels)','Music'],
    min_jamb: null, jamb_competitive: null, min_waec: null,
    a_level_req: 'ABB–AAA', a_level_by_subject: 'Medicine: A*AA · Engineering: ABB (Maths) · Law: ABB · Business: ABB',
    sat_range: '1380–1540.', igcse_req: 'Strong IGCSEs — English & Maths at C/4.',
    direct_entry: null, rating: 4.8, review_count: 1640,
    about: 'Canada\'s most internationally recognised university. QS top 30. Often called "the Harvard of Canada." Bilingual English/French city.',
    logo: 'MCG',
  },
  {
    id: 'ubc', name: 'University of British Columbia (UBC)', location: 'Vancouver, British Columbia', country: 'Canada', type: 'International',
    website: 'https://you.ubc.ca/applying-ubc/', accepts: ['a_level','igcse','ib','sat'],
    notable_programmes: ['Computer Science','Engineering','Business (Sauder)','Medicine','Forestry','Science'],
    min_jamb: null, jamb_competitive: null, min_waec: null,
    a_level_req: 'BBB–AAA', a_level_by_subject: 'CS: ABB (Maths) · Engineering: ABB · Business: ABB',
    sat_range: '1240–1500.', igcse_req: 'Strong IGCSEs — English & Maths at C/4.',
    direct_entry: null, rating: 4.7, review_count: 1420,
    about: 'One of Canada\'s top universities in beautiful Vancouver. QS top 50. Strong CS, Engineering and Business. Scenic west coast location.',
    logo: 'UBC',
  },
  {
    id: 'waterloo', name: 'University of Waterloo', location: 'Waterloo, Ontario', country: 'Canada', type: 'International',
    website: 'https://uwaterloo.ca/future-students/admissions/', accepts: ['a_level','igcse','ib','sat'],
    notable_programmes: ['Computer Science','Software Engineering','Mathematics','Accounting','Mechatronics','Business'],
    min_jamb: null, jamb_competitive: null, min_waec: null,
    a_level_req: 'ABB–A*AA', a_level_by_subject: 'CS: A*AA (Maths req.) · Engineering: AAB (Maths+Physics) · Maths: A*AA',
    sat_range: '1350–1530.', igcse_req: 'IGCSE Maths A*/A highly recommended for STEM.',
    direct_entry: null, rating: 4.7, review_count: 1180,
    about: 'Canada\'s top Computer Science and Engineering university. #1 for co-op placements in North America. Strong Silicon Valley connections.',
    logo: 'UW',
  },
  {
    id: 'mcmaster', name: 'McMaster University', location: 'Hamilton, Ontario', country: 'Canada', type: 'International',
    website: 'https://future.mcmaster.ca/admission/', accepts: ['a_level','igcse','ib','sat'],
    notable_programmes: ['Medicine (PBL model)','Engineering','Health Sciences','Computer Science','Business'],
    min_jamb: null, jamb_competitive: null, min_waec: null,
    a_level_req: 'ABB–AAA', a_level_by_subject: 'Medicine: AAA · Engineering: ABB (Maths) · Health Sci: AAA',
    sat_range: '1300–1480.', igcse_req: 'IGCSE English & Maths at C/4.',
    direct_entry: null, rating: 4.6, review_count: 920,
    about: 'Known for its problem-based medical learning (PBL) model — influential worldwide. Strong Engineering and Health Sciences.',
    logo: 'MCM',
  },
  // ── AUSTRALIA ─────────────────────────────────────────────────────────────
  {
    id: 'melbourne', name: 'University of Melbourne', location: 'Melbourne, Victoria', country: 'Australia', type: 'International',
    website: 'https://study.unimelb.edu.au/how-to-apply/', accepts: ['a_level','igcse','ib','sat'],
    notable_programmes: ['Medicine','Law','Engineering','Commerce','Computer Science','Architecture'],
    min_jamb: null, jamb_competitive: null, min_waec: null,
    a_level_req: 'ABB–AAA', a_level_by_subject: 'Medicine: AAA · Law: AAA · Engineering: ABB',
    sat_range: '1300–1500.', igcse_req: 'IGCSE English at C/4. Other subjects A*–C.',
    direct_entry: null, rating: 4.7, review_count: 1480,
    about: 'Australia\'s #1 university (QS). Strong across all disciplines including Medicine, Law and Engineering. Vibrant Melbourne student life.',
    logo: 'MELB',
  },
  {
    id: 'sydney', name: 'University of Sydney', location: 'Sydney, New South Wales', country: 'Australia', type: 'International',
    website: 'https://www.sydney.edu.au/study/how-to-apply.html', accepts: ['a_level','igcse','ib','sat'],
    notable_programmes: ['Medicine','Law','Engineering','Business','Dentistry','Pharmacy'],
    min_jamb: null, jamb_competitive: null, min_waec: null,
    a_level_req: 'ABB–AAA', a_level_by_subject: 'Medicine: AAA · Law: ABB · Engineering: ABB',
    sat_range: '1270–1490.', igcse_req: 'IGCSE English & Maths at C/4.',
    direct_entry: null, rating: 4.7, review_count: 1310,
    about: 'Australia\'s first university (est. 1850). Iconic Gothic sandstone buildings. QS top 20. Strong Medicine, Law and Business.',
    logo: 'SYD',
  },
  {
    id: 'anu', name: 'Australian National University (ANU)', location: 'Canberra, ACT', country: 'Australia', type: 'International',
    website: 'https://www.anu.edu.au/study/apply', accepts: ['a_level','igcse','ib','sat'],
    notable_programmes: ['Politics & International Relations','Law','Sciences','Engineering','Economics','Arts'],
    min_jamb: null, jamb_competitive: null, min_waec: null,
    a_level_req: 'ABB–AAA', a_level_by_subject: 'Law: AAB · Sciences: ABB · Politics: ABB',
    sat_range: '1270–1480.', igcse_req: 'IGCSE English at C/4.',
    direct_entry: null, rating: 4.6, review_count: 860,
    about: 'Australia\'s national research university. QS top 30. Particularly strong in Politics, International Relations and Sciences. Government connections.',
    logo: 'ANU',
  },
  // ── IRELAND ────────────────────────────────────────────────────────────────
  {
    id: 'tcd', name: 'Trinity College Dublin (TCD)', location: 'Dublin', country: 'Ireland', type: 'International',
    website: 'https://www.tcd.ie/courses/undergraduate/', accepts: ['a_level','igcse','ib'],
    notable_programmes: ['Medicine','Law','Engineering','Computer Science','Business','Pharmacy'],
    min_jamb: null, jamb_competitive: null, min_waec: null,
    a_level_req: 'BBB–AAA', a_level_by_subject: 'Medicine: A*AA · Law: ABB · CS: ABB (Maths) · Engineering: ABB',
    sat_range: null, igcse_req: 'IGCSE English & Maths C/4.',
    direct_entry: null, rating: 4.6, review_count: 980,
    about: 'Ireland\'s top university (est. 1592). QS top 100. Iconic Dublin campus. EU fees available post-Brexit — popular with Nigerian students avoiding UK visa costs.',
    logo: 'TCD',
  },
  {
    id: 'ucd', name: 'University College Dublin (UCD)', location: 'Dublin', country: 'Ireland', type: 'International',
    website: 'https://www.ucd.ie/study/', accepts: ['a_level','igcse','ib'],
    notable_programmes: ['Medicine','Law','Engineering','Business (Smurfit)','Computer Science','Architecture'],
    min_jamb: null, jamb_competitive: null, min_waec: null,
    a_level_req: 'BBB–AAA', a_level_by_subject: 'Medicine: AAA · Law: ABB · Engineering: ABB',
    sat_range: null, igcse_req: 'IGCSE English & Maths C/4.',
    direct_entry: null, rating: 4.5, review_count: 820,
    about: 'Ireland\'s largest university. QS top 200. Smurfit Business School is highly ranked. EU fees make it cost-effective for Nigerian students.',
    logo: 'UCD',
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

const CURRICULUM_LABELS: Record<string, string> = {
  jamb: 'JAMB/UTME', waec: 'WAEC', neco: 'NECO', a_level: 'A-Level',
  igcse: 'IGCSE', ib: 'IB Diploma', edexcel: 'Edexcel', sat: 'SAT', act: 'ACT',
}
const CURRICULUM_COLORS: Record<string, string> = {
  jamb: 'bg-teal-100 text-teal-800', waec: 'bg-orange-100 text-orange-800',
  neco: 'bg-lime-100 text-lime-800', a_level: 'bg-indigo-100 text-indigo-800',
  igcse: 'bg-blue-100 text-blue-800', ib: 'bg-purple-100 text-purple-800',
  edexcel: 'bg-emerald-100 text-emerald-800', sat: 'bg-rose-100 text-rose-800', act: 'bg-amber-100 text-amber-800',
}
const TYPE_COLORS: Record<string, string> = {
  Federal: 'bg-green-100 text-green-800',
  Private: 'bg-blue-100 text-blue-800',
  State: 'bg-yellow-100 text-yellow-800',
  International: 'bg-purple-100 text-purple-800',
}

const COUNTRIES = ['All', 'Nigeria', 'United Kingdom', 'United States', 'Canada', 'Australia', 'Ireland']
const TYPES = ['All', 'Federal', 'Private', 'International']

export default function UniversitiesPage() {
  const [query, setQuery] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('All')
  const [selectedType, setSelectedType] = useState('All')
  const [selectedCurriculum, setSelectedCurriculum] = useState('All')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return UNIVERSITIES.filter(u => {
      if (q && !u.name.toLowerCase().includes(q) &&
        !u.location.toLowerCase().includes(q) &&
        !u.country.toLowerCase().includes(q) &&
        !u.notable_programmes.some(p => p.toLowerCase().includes(q)) &&
        !u.about.toLowerCase().includes(q)) return false
      if (selectedCountry !== 'All' && u.country !== selectedCountry) return false
      if (selectedType !== 'All' && u.type !== selectedType) return false
      if (selectedCurriculum !== 'All' && !u.accepts.includes(selectedCurriculum)) return false
      return true
    })
  }, [query, selectedCountry, selectedType, selectedCurriculum])

  const hasFilters = query || selectedCountry !== 'All' || selectedType !== 'All' || selectedCurriculum !== 'All'
  const clearAll = () => { setQuery(''); setSelectedCountry('All'); setSelectedType('All'); setSelectedCurriculum('All') }

  const countryCounts = useMemo(() => {
    const c: Record<string, number> = {}
    UNIVERSITIES.forEach(u => { c[u.country] = (c[u.country] || 0) + 1 })
    return c
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <DualVideoHero
        leftVideo="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4"
        rightVideo="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-white/60 text-sm mb-3">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white">Universities</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black mb-3">University Guide</h1>
          <p className="text-white/75 max-w-xl mb-6">
            Official entry requirements for Nigerian and international universities — A-Level grades, JAMB cutoffs, IGCSE requirements, and direct links to each admissions page.
          </p>
          <div className="bg-white rounded-xl p-2 flex gap-2 max-w-xl">
            <div className="flex-1 flex items-center gap-3 px-3">
              <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input
                type="text" value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search any university, city, or programme..."
                className="flex-1 text-sm text-slate-800 outline-none placeholder:text-slate-400 bg-transparent"
              />
              {query && <button onClick={() => setQuery('')}><X className="w-4 h-4 text-slate-400 hover:text-slate-600" /></button>}
            </div>
          </div>
        </div>
      </DualVideoHero>

      {/* Stats */}
      <div className="bg-[#0f3460] py-8 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { value: `${UNIVERSITIES.length}+`, label: 'Universities Listed' },
            { value: '6', label: 'Countries' },
            { value: `${UNIVERSITIES.filter(u => u.a_level_req).length}`, label: 'Accept A-Level' },
            { value: `${UNIVERSITIES.filter(u => u.min_jamb).length}`, label: 'Nigerian Universities' },
          ].map(s => (
            <div key={s.label}>
              <div className="text-2xl font-black text-white">{s.value}</div>
              <div className="text-xs text-white/60 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-4">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center gap-3">
          <Filter className="w-4 h-4 text-slate-500 flex-shrink-0" />
          <select value={selectedCountry} onChange={e => setSelectedCountry(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#0f3460]">
            {COUNTRIES.map(c => <option key={c} value={c}>{c} {c !== 'All' ? `(${countryCounts[c] ?? 0})` : ''}</option>)}
          </select>
          <select value={selectedType} onChange={e => setSelectedType(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#0f3460]">
            {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={selectedCurriculum} onChange={e => setSelectedCurriculum(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#0f3460]">
            <option value="All">All Curricula</option>
            {['a_level', 'igcse', 'ib', 'jamb', 'waec', 'sat'].map(c => (
              <option key={c} value={c}>{CURRICULUM_LABELS[c]}</option>
            ))}
          </select>
          {hasFilters && (
            <button onClick={clearAll} className="flex items-center gap-1 text-sm text-[#0f3460] font-semibold hover:underline">
              <X className="w-3.5 h-3.5" /> Clear
            </button>
          )}
          <span className="text-sm text-slate-500 ml-auto font-semibold">{filtered.length} universities</span>
        </div>
      </div>

      {/* List */}
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-4">
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-900 mb-1">No universities found for &ldquo;{query}&rdquo;</h3>
            <p className="text-sm text-slate-500 mb-4">Try a different name or clear filters.</p>
            <button onClick={clearAll} className="text-sm font-semibold text-[#0f3460] hover:underline">Clear all filters</button>
          </div>
        )}

        {filtered.map(uni => {
          const expanded = expandedId === uni.id
          return (
            <div key={uni.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-[#0f3460] hover:shadow-md transition-all">
              <div className="p-6">
                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-xl nexora-gradient flex items-center justify-center text-white font-black text-xs flex-shrink-0">
                    {uni.logo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-0.5">
                      <h3 className="font-black text-slate-900 text-base leading-snug">{uni.name}</h3>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${TYPE_COLORS[uni.type]}`}>{uni.type}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500 mb-1">
                      <MapPin className="w-3 h-3" /> {uni.location}, {uni.country}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-sm font-bold text-slate-800">{uni.rating}</span>
                      <span className="text-xs text-slate-500">({uni.review_count.toLocaleString()} reviews)</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed mt-3 mb-4">{uni.about}</p>

                {/* Requirements grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                  {uni.min_jamb && (
                    <div className="bg-teal-50 border border-teal-200 rounded-xl p-3">
                      <div className="text-xs font-bold text-teal-700 uppercase tracking-wide mb-1">JAMB / UTME</div>
                      <div className="text-sm font-black text-teal-900">Min: {uni.min_jamb} pts</div>
                      {uni.jamb_competitive && <div className="text-xs text-teal-700 mt-0.5">{uni.jamb_competitive}</div>}
                    </div>
                  )}
                  {uni.a_level_req && (
                    <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3">
                      <div className="text-xs font-bold text-indigo-700 uppercase tracking-wide mb-1">A-Level</div>
                      <div className="text-sm font-black text-indigo-900">{uni.a_level_req}</div>
                      {uni.a_level_by_subject && <div className="text-xs text-indigo-700 mt-0.5">{uni.a_level_by_subject}</div>}
                    </div>
                  )}
                  {uni.igcse_req && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                      <div className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-1">IGCSE / O-Level</div>
                      <div className="text-xs text-blue-800">{uni.igcse_req}</div>
                    </div>
                  )}
                  {uni.sat_range && (
                    <div className="bg-rose-50 border border-rose-200 rounded-xl p-3">
                      <div className="text-xs font-bold text-rose-700 uppercase tracking-wide mb-1">SAT / ACT</div>
                      <div className="text-xs text-rose-900">{uni.sat_range}</div>
                    </div>
                  )}
                  {uni.min_waec && (
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-3">
                      <div className="text-xs font-bold text-orange-700 uppercase tracking-wide mb-1">WAEC / NECO</div>
                      <div className="text-sm font-black text-orange-900">Min {uni.min_waec} credits</div>
                      <div className="text-xs text-orange-700 mt-0.5">Must include English & Maths</div>
                    </div>
                  )}
                </div>

                {/* Accepts + Programmes */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {uni.accepts.map(c => (
                    <span key={c} className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CURRICULUM_COLORS[c] ?? 'bg-slate-100 text-slate-700'}`}>
                      {CURRICULUM_LABELS[c] ?? c}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {uni.notable_programmes.map(p => (
                    <span key={p} className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">{p}</span>
                  ))}
                </div>

                {/* Direct entry expand */}
                {uni.direct_entry && (
                  <button onClick={() => setExpandedId(expanded ? null : uni.id)}
                    className="text-xs font-semibold text-[#0f3460] hover:underline mb-4 flex items-center gap-1">
                    {expanded ? 'Hide Direct Entry details' : 'Show Direct Entry (A-Level) details'}
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-90' : ''}`} />
                  </button>
                )}
                {expanded && uni.direct_entry && (
                  <div className="bg-slate-50 rounded-xl p-4 mb-4">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-slate-700">{uni.direct_entry}</p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Link href={`/tutors?curriculum=${uni.accepts[0]}`}
                    className="flex-1 text-center text-xs font-semibold text-[#0f3460] border border-[#0f3460] py-2.5 rounded-xl hover:bg-blue-50 transition-colors">
                    Find a Tutor
                  </Link>
                  <a href={uni.website} target="_blank" rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-white nexora-gradient py-2.5 rounded-xl hover:opacity-90 transition-opacity">
                    Official Admissions <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* CTA */}
      <section className="py-16 px-4 nexora-gradient text-white">
        <div className="max-w-3xl mx-auto text-center">
          <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <h2 className="text-2xl font-black mb-3">Need Help With Your University Application?</h2>
          <p className="text-white/75 mb-6">Our verified tutors specialise in university entrance preparation — A-Level, JAMB, SAT, IELTS, TOEFL, personal statements, and UCAS applications.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/tutors" className="bg-white text-[#0f3460] font-bold px-6 py-3 rounded-xl hover:bg-slate-100 transition-colors inline-flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Find a Tutor
            </Link>
            <Link href="/register" className="bg-white/10 border border-white/30 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/20 transition-colors">
              Get Started Free
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
