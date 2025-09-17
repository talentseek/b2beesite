import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create sample bees
  const appointmentBee = await prisma.bee.create({
    data: {
      slug: 'appointment-bee',
      name: 'Appointment Bee',
      tagline: 'Your 24/7 virtual receptionist',
      role: 'Reception',
      status: 'ACTIVE',
      shortDescription: 'Never miss a call again with AI-powered appointment booking',
      description: 'Appointment Bee handles incoming calls, schedules appointments, and manages your calendar automatically.',
      longDescription: 'Transform your business with intelligent call handling. Appointment Bee answers calls 24/7, understands customer intent, and books appointments directly into your calendar. Perfect for busy professionals who want to capture every opportunity.',
      imageUrl: '/uploads/appointment-bee.jpg',
      features: {
        "24/7 Availability": "Never miss a call, even outside business hours",
        "Intelligent Routing": "Automatically routes calls to the right person or department",
        "Calendar Integration": "Seamlessly integrates with Google Calendar, Outlook, and more",
        "Multi-language Support": "Handles calls in multiple languages",
        "Call Recording": "All calls are recorded for quality assurance",
        "SMS Confirmations": "Sends automatic SMS confirmations to customers"
      },
      integrations: {
        "Calendar": ["Google Calendar", "Outlook", "iCal"],
        "CRM": ["Salesforce", "HubSpot", "Pipedrive"],
        "Communication": ["Slack", "Teams", "Email"],
        "Payment": ["Stripe", "PayPal", "Square"]
      },
      roiModel: {
        "assumptions": {
          "calls_per_month": 400,
          "avg_call_length_minutes": 3,
          "staff_cost_per_hour": 25,
          "bee_monthly_cost": 200,
          "bee_usage_rate": 0.15
        },
        "calculations": {
          "human_cost_per_month": 2000,
          "bee_cost_per_month": 380,
          "savings_percentage": 81
        }
      },
      faqs: [
        {
          "question": "How accurate is the appointment booking?",
          "answer": "Our AI achieves 95%+ accuracy in understanding customer intent and booking appointments correctly."
        },
        {
          "question": "Can it handle complex scheduling scenarios?",
          "answer": "Yes, it can handle recurring appointments, multiple attendees, and complex availability rules."
        },
        {
          "question": "What if a customer needs to reschedule?",
          "answer": "Customers can easily reschedule through SMS or by calling back. The system handles all the calendar updates automatically."
        },
        {
          "question": "Is it available in multiple languages?",
          "answer": "Yes, we support English, Spanish, French, German, and more. Additional languages can be added on request."
        }
      ],
      demoAssets: {
        "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        "screenshots": [
          "/uploads/appointment-bee-demo-1.jpg",
          "/uploads/appointment-bee-demo-2.jpg"
        ]
      },
      seoTitle: 'AI Appointment Booking Assistant | 24/7 Virtual Receptionist',
      seoDescription: 'Never miss a call again with our AI-powered appointment booking assistant. 24/7 availability, intelligent routing, and seamless calendar integration.',
      seoOgImage: '/uploads/appointment-bee-og.jpg',
      prices: {
        create: [
          { currencyCode: 'GBP', amount: 200 },
          { currencyCode: 'USD', amount: 250 },
          { currencyCode: 'EUR', amount: 230 }
        ]
      },
      usagePricing: {
        create: [
          {
            currencyCode: 'GBP',
            usageType: 'per_minute',
            ratePerUnit: 0.15,
            unitDescription: 'per minute'
          },
          {
            currencyCode: 'USD',
            usageType: 'per_minute',
            ratePerUnit: 0.20,
            unitDescription: 'per minute'
          },
          {
            currencyCode: 'EUR',
            usageType: 'per_minute',
            ratePerUnit: 0.18,
            unitDescription: 'per minute'
          }
        ]
      }
    }
  })

  const guardBee = await prisma.bee.create({
    data: {
      slug: 'guard-bee',
      name: 'Guard Bee',
      tagline: 'AI-powered security monitoring',
      role: 'Security',
      status: 'ACTIVE',
      shortDescription: '24/7 intelligent security monitoring and threat detection',
      description: 'Guard Bee monitors your premises, detects threats, and alerts you instantly.',
      longDescription: 'Advanced AI security monitoring that never sleeps. Guard Bee analyzes video feeds, detects unusual activity, and provides instant alerts. Perfect for businesses that need reliable security without the cost of human guards.',
      imageUrl: '/uploads/guard-bee.jpg',
      features: {
        "24/7 Monitoring": "Continuous surveillance with AI-powered analysis",
        "Threat Detection": "Advanced algorithms detect suspicious activity",
        "Instant Alerts": "Real-time notifications via SMS, email, or app",
        "Video Analytics": "Intelligent analysis of video feeds",
        "Access Control": "Manage entry points and visitor access",
        "Incident Reports": "Detailed reports of all security events"
      },
      integrations: {
        "Cameras": ["IP Cameras", "CCTV Systems", "Doorbell Cameras"],
        "Access Control": ["Keycard Systems", "Biometric Scanners", "Smart Locks"],
        "Alerts": ["SMS", "Email", "Mobile Apps", "Slack"],
        "Storage": ["Cloud Storage", "Local Storage", "Backup Systems"]
      },
      roiModel: {
        "assumptions": {
          "security_incidents_per_month": 2,
          "guard_cost_per_hour": 15,
          "bee_monthly_cost": 150,
          "prevention_value": 5000
        },
        "calculations": {
          "human_guard_cost_per_month": 10800,
          "bee_cost_per_month": 150,
          "savings_percentage": 98.6
        }
      },
      faqs: [
        {
          "question": "How accurate is the threat detection?",
          "answer": "Our AI achieves 99%+ accuracy in detecting real threats while minimizing false alarms."
        },
        {
          "question": "What happens during a power outage?",
          "answer": "The system has backup power and continues monitoring. All events are logged and synced when power returns."
        },
        {
          "question": "Can it integrate with existing security systems?",
          "answer": "Yes, it integrates with most major security systems and cameras on the market."
        }
      ],
      demoAssets: {
        "video_url": "https://www.youtube.com/watch?v=W521nwxkytY",
        "screenshots": [
          "/uploads/guard-bee-demo-1.jpg",
          "/uploads/guard-bee-demo-2.jpg"
        ]
      },
      seoTitle: 'AI Security Monitoring | 24/7 Intelligent Surveillance',
      seoDescription: 'Advanced AI security monitoring with 24/7 surveillance, threat detection, and instant alerts. Protect your business with intelligent security.',
      seoOgImage: '/uploads/guard-bee-og.jpg',
      prices: {
        create: [
          { currencyCode: 'GBP', amount: 150 },
          { currencyCode: 'USD', amount: 190 },
          { currencyCode: 'EUR', amount: 175 }
        ]
      }
    }
  })

  const salesBee = await prisma.bee.create({
    data: {
      slug: 'sales-bee',
      name: 'Sales Bee',
      tagline: 'AI sales assistant that never sleeps',
      role: 'Sales',
      status: 'ACTIVE',
      shortDescription: 'Automate lead qualification and follow-up with AI',
      description: 'Sales Bee qualifies leads, schedules demos, and follows up automatically.',
      longDescription: 'Transform your sales process with AI-powered lead qualification and follow-up. Sales Bee engages prospects 24/7, qualifies leads based on your criteria, and schedules demos with your team. Never let a hot lead go cold again.',
      imageUrl: '/uploads/sales-bee.jpg',
      features: {
        "Lead Qualification": "AI-powered lead scoring and qualification",
        "24/7 Engagement": "Engage prospects anytime, anywhere",
        "Demo Scheduling": "Automatically schedule demos with your team",
        "Follow-up Sequences": "Intelligent follow-up campaigns",
        "CRM Integration": "Seamless integration with your CRM",
        "Performance Analytics": "Detailed insights into lead quality and conversion"
      },
      integrations: {
        "CRM": ["Salesforce", "HubSpot", "Pipedrive", "Zoho"],
        "Calendar": ["Google Calendar", "Outlook", "Calendly"],
        "Communication": ["Email", "SMS", "WhatsApp", "Slack"],
        "Analytics": ["Google Analytics", "Mixpanel", "Amplitude"]
      },
      roiModel: {
        "assumptions": {
          "leads_per_month": 100,
          "conversion_rate": 0.15,
          "avg_deal_value": 5000,
          "bee_monthly_cost": 300,
          "time_saved_per_lead": 2
        },
        "calculations": {
          "additional_revenue_per_month": 7500,
          "bee_cost_per_month": 300,
          "roi_percentage": 2400
        }
      },
      faqs: [
        {
          "question": "How does it qualify leads?",
          "answer": "It uses AI to analyze prospect responses and behavior, scoring leads based on your specific criteria."
        },
        {
          "question": "Can it handle complex sales processes?",
          "answer": "Yes, it can be configured for multi-step sales processes with different qualification criteria."
        },
        {
          "question": "What if a prospect wants to speak to a human?",
          "answer": "It can seamlessly transfer qualified leads to your sales team for human interaction."
        }
      ],
      demoAssets: {
        "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        "screenshots": [
          "/uploads/sales-bee-demo-1.jpg",
          "/uploads/sales-bee-demo-2.jpg"
        ]
      },
      seoTitle: 'AI Sales Assistant | Lead Qualification & Follow-up Automation',
      seoDescription: 'Automate lead qualification and follow-up with AI. Never let a hot lead go cold with 24/7 engagement and intelligent lead scoring.',
      seoOgImage: '/uploads/sales-bee-og.jpg',
      prices: {
        create: [
          { currencyCode: 'GBP', amount: 300 },
          { currencyCode: 'USD', amount: 375 },
          { currencyCode: 'EUR', amount: 345 }
        ]
      }
    }
  })

  const supportBee = await prisma.bee.create({
    data: {
      slug: 'support-bee',
      name: 'Support Bee',
      tagline: 'AI customer support that actually helps',
      role: 'Support',
      status: 'ACTIVE',
      shortDescription: 'Resolve customer issues instantly with AI',
      description: 'Support Bee answers common questions and escalates complex issues.',
      longDescription: 'Provide instant customer support 24/7 with AI-powered assistance. Support Bee understands customer issues, provides helpful answers, and escalates complex problems to your team. Improve customer satisfaction while reducing support costs.',
      imageUrl: '/uploads/support-bee.jpg',
      features: {
        "Instant Responses": "Get answers to common questions immediately",
        "Issue Resolution": "Resolve simple issues without human intervention",
        "Smart Escalation": "Escalate complex issues to the right team member",
        "Knowledge Base": "Learn from your existing documentation and FAQs",
        "Multi-channel Support": "Support via chat, email, and phone",
        "Customer Satisfaction": "Track and improve customer satisfaction scores"
      },
      integrations: {
        "Help Desk": ["Zendesk", "Freshdesk", "Intercom", "Help Scout"],
        "Knowledge Base": ["Notion", "Confluence", "Documentation Sites"],
        "Communication": ["Slack", "Teams", "Email", "SMS"],
        "Analytics": ["Google Analytics", "Mixpanel", "Customer Feedback"]
      },
      roiModel: {
        "assumptions": {
          "support_tickets_per_month": 500,
          "avg_resolution_time_hours": 4,
          "support_agent_cost_per_hour": 20,
          "bee_monthly_cost": 250,
          "automation_rate": 0.6
        },
        "calculations": {
          "cost_savings_per_month": 2400,
          "bee_cost_per_month": 250,
          "savings_percentage": 85.6
        }
      },
      faqs: [
        {
          "question": "How accurate are the responses?",
          "answer": "Our AI achieves 90%+ accuracy in providing helpful responses to customer inquiries."
        },
        {
          "question": "What if it can't answer a question?",
          "answer": "It will escalate the issue to a human agent with all the context and conversation history."
        },
        {
          "question": "Can it learn from our existing documentation?",
          "answer": "Yes, it can be trained on your existing knowledge base, FAQs, and support documentation."
        }
      ],
      demoAssets: {
        "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        "screenshots": [
          "/uploads/support-bee-demo-1.jpg",
          "/uploads/support-bee-demo-2.jpg"
        ]
      },
      seoTitle: 'AI Customer Support | 24/7 Intelligent Help Desk',
      seoDescription: 'Provide instant customer support 24/7 with AI. Resolve issues faster, reduce support costs, and improve customer satisfaction.',
      seoOgImage: '/uploads/support-bee-og.jpg',
      prices: {
        create: [
          { currencyCode: 'GBP', amount: 250 },
          { currencyCode: 'USD', amount: 310 },
          { currencyCode: 'EUR', amount: 285 }
        ]
      }
    }
  })

  const workerBee = await prisma.bee.create({
    data: {
      slug: 'worker-bee',
      name: 'Worker Bee',
      tagline: 'AI task automation for your business',
      role: 'Automation',
      status: 'ACTIVE',
      shortDescription: 'Automate repetitive tasks and workflows',
      description: 'Worker Bee handles data entry, document processing, and workflow automation.',
      longDescription: 'Eliminate repetitive tasks and boost productivity with AI-powered automation. Worker Bee handles data entry, document processing, email management, and workflow automation. Focus on what matters while AI handles the rest.',
      imageUrl: '/uploads/worker-bee.jpg',
      features: {
        "Data Entry": "Automate data entry from forms, emails, and documents",
        "Document Processing": "Extract information from PDFs, images, and scanned documents",
        "Email Management": "Sort, categorize, and respond to emails automatically",
        "Workflow Automation": "Create custom workflows for your business processes",
        "API Integration": "Connect with your existing tools and systems",
        "Reporting": "Generate automated reports and insights"
      },
      integrations: {
        "Productivity": ["Google Workspace", "Microsoft 365", "Notion", "Airtable"],
        "Communication": ["Slack", "Teams", "Email", "SMS"],
        "Storage": ["Google Drive", "Dropbox", "OneDrive", "Box"],
        "CRM": ["Salesforce", "HubSpot", "Pipedrive", "Zoho"]
      },
      roiModel: {
        "assumptions": {
          "tasks_automated_per_month": 1000,
          "time_saved_per_task_minutes": 5,
          "hourly_rate": 25,
          "bee_monthly_cost": 400,
          "accuracy_rate": 0.95
        },
        "calculations": {
          "time_saved_per_month_hours": 83.3,
          "cost_savings_per_month": 2083,
          "bee_cost_per_month": 400,
          "savings_percentage": 80.8
        }
      },
      faqs: [
        {
          "question": "What types of tasks can it automate?",
          "answer": "It can automate data entry, document processing, email management, and custom workflows."
        },
        {
          "question": "How accurate is the automation?",
          "answer": "Our AI achieves 95%+ accuracy in task automation with human oversight for complex tasks."
        },
        {
          "question": "Can it integrate with our existing systems?",
          "answer": "Yes, it integrates with most popular business tools and can be customized for your specific needs."
        }
      ],
      demoAssets: {
        "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        "screenshots": [
          "/uploads/worker-bee-demo-1.jpg",
          "/uploads/worker-bee-demo-2.jpg"
        ]
      },
      seoTitle: 'AI Task Automation | Business Process Automation',
      seoDescription: 'Automate repetitive tasks and workflows with AI. Boost productivity, reduce errors, and focus on what matters most.',
      seoOgImage: '/uploads/worker-bee-og.jpg',
      prices: {
        create: [
          { currencyCode: 'GBP', amount: 400 },
          { currencyCode: 'USD', amount: 500 },
          { currencyCode: 'EUR', amount: 460 }
        ]
      }
    }
  })

  // Create sample CTA packs
  const defaultCTAPack = await prisma.cTAPack.create({
    data: {
      name: 'default-book-demo',
      primary: {
        "label": "Book a Demo",
        "action": "demo"
      },
      secondary: {
        "label": "Start Free Trial",
        "action": "trial"
      },
      microcopy: "No credit card required • 15-minute demo • Cancel anytime"
    }
  })

  const comingSoonCTAPack = await prisma.cTAPack.create({
    data: {
      name: 'coming-soon-notify',
      primary: {
        "label": "Notify Me at Launch",
        "action": "notify"
      },
      secondary: {
        "label": "Learn More",
        "action": "info"
      },
      microcopy: "Get early access • Exclusive launch pricing • No spam"
    }
  })

  console.log('✅ Database seeded successfully!')
  console.log(`Created ${await prisma.bee.count()} bees`)
  console.log(`Created ${await prisma.cTAPack.count()} CTA packs`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
