export default {
  "name": "Spondon Saha",
  "title": "Cybersecurity Researcher",
  "tagline": "Cybersecurity Researcher & Bug Bounty Hunter",
  "heroLines": [
    "I identify vulnerabilities, secure systems, and share knowledge to make the digital world safer.",
    "Specializing in web application security, penetration testing, and security research."
  ],
  "resumeUrl": "/resume-spondon.pdf",
  "photo": "/me.jpeg",
  "about": {
    "paragraphs": [
      "Hi, I'm Spondon Saha \u2014 a passionate cybersecurity student and security researcher currently working with online platforms. I love exploring web vulnerabilities, understanding how systems work, and helping make the internet a safer place.",
      "I've completed certifications in CEH, Python with Django, and various Cisco Networking modules.",
      "I'm currently studying at Gono University, and constantly sharpening my skills in ethical hacking, networking, and security research. I believe in continuous learning, sharing knowledge, and making meaningful contributions to the cybersecurity community.",
      "My journey in cybersecurity began with a deep curiosity about how systems work and how they can be broken. This led me to pursue certifications and hands-on experience in bug bounty programs, where I've successfully identified critical vulnerabilities in various web applications."
    ]
  },
  "skills": {
    "technical": [
      "Penetration Testing",
      "Web App Security",
      "Network Security",
      "Vulnerability Research",
      "Python",
      "Django",
      "OWASP Top 10",
      "Burp Suite",
      "Nmap",
      "Metasploit"
    ],
    "tools": [
      "Burp Suite",
      "Python",
      "Nmap",
      "Metasploit",
      "OWASP ZAP",
      "Kali Linux"
    ]
  },
  "projects": [
    {
      "slug": "bug-bounty-methodology",
      "title": "Bug Bounty Methodology",
      "category": "Research",
      "year": "2024",
      "summary": "A public write-up of the recon-to-report workflow used across bug bounty engagements \u2014 scoping, enumeration, and triage.",
      "description": "A structured methodology covering how targets are scoped, how attack surface is enumerated (subdomains, endpoints, parameters), which classes of vulnerabilities get prioritized first, and how findings are documented for maximum clarity and payout. Written to be a living reference, updated as tooling and techniques evolve.",
      "tags": [
        "Recon",
        "Web Security",
        "Methodology"
      ],
      "image": "/projects/methodology.png",
      "links": [
        {
          "label": "Read the methodology",
          "url": "https://spondonsaha.github.io/bug-bounty-methodology/"
        }
      ]
    },
    {
      "slug": "idor-university-system",
      "title": "IDOR in a University Management System",
      "category": "Disclosure",
      "year": "2023",
      "summary": "Discovered and responsibly disclosed a critical IDOR exposing payment records across all users of a university's IEMS platform.",
      "description": "By manipulating a predictable, sequential resource identifier in an authenticated API request, it was possible to view another user's payment and enrollment records without authorization. Reported through the institution's security contact with full reproduction steps; remediated by introducing per-user authorization checks server-side.",
      "tags": [
        "IDOR",
        "Access Control",
        "API Security"
      ],
      "image": "/proof/proof1.png",
      "links": []
    },
    {
      "slug": "2fa-bypass",
      "title": "Two-Factor Authentication Bypass",
      "category": "Disclosure",
      "year": "2023",
      "summary": "Identified a logic flaw that allowed the two-factor step of a login flow to be skipped entirely under certain conditions.",
      "description": "A race condition / state-handling flaw in the authentication flow meant the second factor could be bypassed if the session token issued after the first factor was reused directly against a protected endpoint. Reported with a proof-of-concept and remediation recommendation; the fix involved binding the session state to a completed second-factor check server-side.",
      "tags": [
        "Authentication",
        "2FA",
        "Logic Flaw"
      ],
      "image": "/proof/proof2.png",
      "links": []
    },
    {
      "slug": "reflected-xss",
      "title": "Reflected XSS on a UK Media Site",
      "category": "Disclosure",
      "year": "2023",
      "summary": "Found and reported a reflected Cross-Site Scripting vulnerability on a high-traffic UK-based website.",
      "description": "A search parameter was reflected into the page without adequate output encoding, allowing arbitrary script execution in a victim's browser via a crafted link. Reported with a working payload and a suggested fix (context-aware output encoding + a Content-Security-Policy).",
      "tags": [
        "XSS",
        "Input Validation",
        "OWASP Top 10"
      ],
      "image": "/proof/proof3.png",
      "links": []
    }
  ],
  "certifications": [
    {
      "title": "Certified Ethical Hacker",
      "org": "Creative IT Institute",
      "image": "/certs/ceh.png",
      "verifyUrl": "https://certificate.citsmp.com/?certificate_id=CEH-23040217"
    },
    {
      "title": "Ethical Hacker",
      "org": "Cisco Network Academy",
      "image": "/certs/ethical-hacker.png",
      "verifyUrl": "https://www.credly.com/badges/67f46512-7cc0-40ba-8bb1-7c229ca8cd74/email"
    },
    {
      "title": "Programming in Python",
      "org": "National Academy Center And Research (NACTAR)",
      "image": "/certs/nactar.jpeg",
      "verifyUrl": "https://nactar.gov.bd/"
    },
    {
      "title": "Networking Basics",
      "org": "Cisco Network Academy",
      "image": "/certs/networking-basics.png",
      "verifyUrl": "https://www.credly.com/badges/19bd3099-ea2b-45bb-8bc8-1f233638b864/public_url"
    },
    {
      "title": "Networking Device and Initial Configuration",
      "org": "Cisco Network Academy",
      "image": "/certs/initial-config.png",
      "verifyUrl": "https://www.credly.com/badges/d5370cdd-6de1-4c19-9bef-406a21a5204c/public_url"
    },
    {
      "title": "Linux Operating System",
      "org": "StudySection",
      "image": "/certs/linux.png",
      "verifyUrl": "https://www.studysection.com/verify-certificate-authenticity"
    },
    {
      "title": "CCNA",
      "org": "National Academy Center For Training And Research",
      "image": "/certs/ccna.png",
      "verifyUrl": "https://www.credly.com/badges/7a27d7d0-6d24-4dd0-a052-d63b4741b9df"
    },
    {
      "title": "Cisco Network Security (Planned)",
      "org": "National Academy Center For Training And Research",
      "image": "/certs/cisco.jpeg",
      "verifyUrl": "https://www.netacad.com/courses/network-security?courseLang=en-US"
    }
  ],
  "experience": [
    {
      "tag": "IDOR",
      "date": "2023-05-15",
      "severity": "critical",
      "title": "IDOR Vulnerability Found",
      "description": "Identified a critical IDOR vulnerability in a University Management System (IEMS) that exposed sensitive payment records across all users.",
      "image": "/proof/proof1.png"
    },
    {
      "tag": "Pentesting",
      "date": "2023-04-28",
      "severity": "high",
      "title": "2FA Bypass Identified",
      "description": "Found a security issue related to Two-Factor Authentication (2FA) bypass. A great experience working with the affected team.",
      "image": "/proof/proof2.png"
    },
    {
      "tag": "XSS",
      "date": "2023-04-10",
      "severity": "medium",
      "title": "Cross-Site Scripting (XSS)",
      "description": "Identified a reflected Cross-Site Scripting (XSS) vulnerability on a reputable UK-based website.",
      "image": "/proof/proof3.png"
    }
  ],
  "awards": [
    {
      "tag": "IDOR",
      "date": "2026-01-05",
      "title": "Drexel University",
      "description": "Appreciated by Drexel University for contributions and achievement.",
      "hofUrl": "https://drexel.edu/it/security/services-processes/bug-bounty",
      "hofLabel": "Drexel Edu",
      "image": "/awards/drexel.jpg"
    },
    {
      "tag": "Pentesting",
      "date": "2025-11-13",
      "title": "National Aeronautics and Space Administration (NASA)",
      "description": "Honored by NASA for contributions and achievements, highlighting a commitment to excellence and innovation.",
      "hofUrl": "",
      "hofLabel": "",
      "image": "/awards/nasa.jpg"
    },
    {
      "tag": "Competition",
      "date": "2026-01-16",
      "title": "PC Builder Bangladesh",
      "description": "Winner of the Major Category in the PC Builder Bangladesh Bug Hunt Competition.",
      "hofUrl": "",
      "hofLabel": "",
      "image": "/awards/pcb-bug.jpeg"
    }
  ],
  "contact": {
    "email": "workspondon@gmail.com",
    "linkedin": "https://www.linkedin.com/in/spondonsaha/",
    "github": "https://github.com/spondonsaha",
    "facebook": "https://www.facebook.com/share/1Ei1sHZtCz/"
  }
};
