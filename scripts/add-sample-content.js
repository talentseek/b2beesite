const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:e120fleB@neon-db.fly.dev:5432/b2bee'
})

async function addSampleContent() {
  const client = await pool.connect()
  
  try {
    console.log('Adding sample content to existing bees...')

    // Sample data for each bee
    const sampleData = {
      'buzz-lightyear': {
        tagline: 'Your 24/7 AI receptionist that never sleeps',
        short_description: 'Handle customer calls automatically with AI that sounds human and never misses a call.',
        long_description: 'Buzz Lightyear is your round-the-clock virtual receptionist that handles customer calls with natural conversation, appointment booking, and intelligent call routing. Perfect for businesses that want to provide 24/7 customer service without the overhead of human staff.',
        features: [
          '24/7 Availability',
          'Natural Language Processing',
          'Multi-language Support',
          'Custom Branding',
          'Call Recording & Analytics',
          'Seamless Handoff to Humans',
          'Integration with CRM Systems',
          'Custom Greetings & Scripts'
        ],
        integrations: [
          'Google Calendar',
          'Outlook Calendar',
          'Salesforce',
          'HubSpot',
          'Zapier',
          'Slack',
          'Microsoft Teams',
          'WhatsApp Business'
        ],
        roi_model: {
          traditional_cost_description: 'Traditional receptionists cost £25,000+ annually with limited hours and human limitations.',
          assumptions: {
            traditional_receptionist_cost: 25000,
            traditional_hours_per_week: 40,
            bee_cost_per_month: 200,
            bee_hours_per_week: 168
          }
        },
        faqs: [
          {
            question: 'How does Buzz Lightyear handle complex customer queries?',
            answer: 'Buzz uses advanced AI to understand context and intent, and can seamlessly hand off to human agents when needed for complex issues.'
          },
          {
            question: 'Can I customize the voice and personality?',
            answer: 'Yes! You can choose from multiple voices and customize the personality to match your brand and customer service style.'
          },
          {
            question: 'What happens if the AI doesn\'t understand a customer?',
            answer: 'Buzz is programmed to politely ask for clarification and can transfer to a human agent if needed, ensuring no customer is left frustrated.'
          },
          {
            question: 'How quickly can I get started?',
            answer: 'Setup takes just 30 minutes! We\'ll configure your greeting, business hours, and integrate with your existing systems.'
          }
        ],
        usage_pricing: {
          USD: {
            usage_type: 'per_minute',
            rate_per_unit: '0.15',
            unit_description: 'per minute'
          },
          GBP: {
            usage_type: 'per_minute',
            rate_per_unit: '0.12',
            unit_description: 'per minute'
          },
          EUR: {
            usage_type: 'per_minute',
            rate_per_unit: '0.14',
            unit_description: 'per minute'
          }
        },
        seo_title: 'Buzz Lightyear - 24/7 AI Receptionist | B2BEE',
        seo_description: 'Never miss a customer call with our AI receptionist. 24/7 availability, natural conversations, and seamless CRM integration.',
        seo_og_image: '/uploads/buzz-lightyear-social.jpg'
      },
      'honey-bee': {
        tagline: 'Sweeten your sales with AI-powered lead qualification',
        short_description: 'Automatically qualify leads, schedule meetings, and nurture prospects with intelligent conversation.',
        long_description: 'Honey Bee transforms your lead generation process with AI that can qualify prospects, answer product questions, and schedule sales meetings automatically. Our AI understands your product and can handle complex sales conversations while maintaining a warm, human touch.',
        features: [
          'Lead Qualification',
          'Meeting Scheduling',
          'Product Knowledge Base',
          'Sales Script Management',
          'Lead Scoring',
          'CRM Integration',
          'Follow-up Automation',
          'Performance Analytics'
        ],
        integrations: [
          'Salesforce',
          'HubSpot',
          'Pipedrive',
          'Calendly',
          'Zoom',
          'Microsoft Teams',
          'Slack',
          'Mailchimp'
        ],
        roi_model: {
          traditional_cost_description: 'Sales development representatives cost £35,000+ annually with variable performance and high turnover.',
          assumptions: {
            traditional_sdr_cost: 35000,
            traditional_leads_per_month: 50,
            bee_cost_per_month: 300,
            bee_leads_per_month: 150
          }
        },
        faqs: [
          {
            question: 'Can Honey Bee handle technical product questions?',
            answer: 'Yes! Honey Bee is trained on your specific product knowledge and can answer detailed technical questions accurately.'
          },
          {
            question: 'How does the lead qualification process work?',
            answer: 'Honey Bee uses conversation analysis to assess prospect fit, budget, authority, need, and timeline (BANT criteria).'
          },
          {
            question: 'What if a prospect wants to speak to a human immediately?',
            answer: 'Honey Bee can instantly transfer calls to your sales team or schedule a callback at the prospect\'s convenience.'
          },
          {
            question: 'How do you measure lead quality?',
            answer: 'We track conversion rates, meeting attendance, and sales outcomes to continuously improve lead qualification accuracy.'
          }
        ],
        usage_pricing: {
          USD: {
            usage_type: 'per_lead',
            rate_per_unit: '2.50',
            unit_description: 'per qualified lead'
          },
          GBP: {
            usage_type: 'per_lead',
            rate_per_unit: '2.00',
            unit_description: 'per qualified lead'
          },
          EUR: {
            usage_type: 'per_lead',
            rate_per_unit: '2.30',
            unit_description: 'per qualified lead'
          }
        },
        seo_title: 'Honey Bee - AI Sales Lead Qualification | B2BEE',
        seo_description: 'Automate lead qualification and meeting scheduling with AI. Increase sales efficiency and never miss a hot prospect.',
        seo_og_image: '/uploads/honey-bee-social.jpg'
      },
      'queen-bee': {
        tagline: 'Rule your customer service kingdom with AI',
        short_description: 'Manage customer support at scale with intelligent ticket routing and automated issue resolution.',
        long_description: 'Queen Bee is your AI customer service manager that handles support tickets, routes issues to the right team members, and resolves common problems automatically. Perfect for growing businesses that need to scale customer support without proportional staff increases.',
        features: [
          'Intelligent Ticket Routing',
          'Automated Issue Resolution',
          'Knowledge Base Integration',
          'Escalation Management',
          'Customer Satisfaction Tracking',
          'Multi-channel Support',
          'Performance Analytics',
          'Team Collaboration Tools'
        ],
        integrations: [
          'Zendesk',
          'Freshdesk',
          'Intercom',
          'Help Scout',
          'Slack',
          'Microsoft Teams',
          'Jira',
          'Notion'
        ],
        roi_model: {
          traditional_cost_description: 'Customer service managers cost £40,000+ annually with limited scalability and human error.',
          assumptions: {
            traditional_manager_cost: 40000,
            traditional_tickets_per_month: 500,
            bee_cost_per_month: 400,
            bee_tickets_per_month: 2000
          }
        },
        faqs: [
          {
            question: 'How does Queen Bee learn to handle new issues?',
            answer: 'Queen Bee continuously learns from resolved tickets and can be trained on new product features and common issues.'
          },
          {
            question: 'Can Queen Bee handle complex technical support?',
            answer: 'Queen Bee can handle most common issues and intelligently escalates complex technical problems to human specialists.'
          },
          {
            question: 'How do you measure customer satisfaction?',
            answer: 'We track resolution time, customer feedback scores, and issue resolution rates to ensure high satisfaction.'
          },
          {
            question: 'What if Queen Bee makes a mistake?',
            answer: 'All interactions are logged and reviewed. Queen Bee learns from corrections to improve future responses.'
          }
        ],
        usage_pricing: {
          USD: {
            usage_type: 'per_ticket',
            rate_per_unit: '0.50',
            unit_description: 'per support ticket'
          },
          GBP: {
            usage_type: 'per_ticket',
            rate_per_unit: '0.40',
            unit_description: 'per support ticket'
          },
          EUR: {
            usage_type: 'per_ticket',
            rate_per_unit: '0.45',
            unit_description: 'per support ticket'
          }
        },
        seo_title: 'Queen Bee - AI Customer Service Management | B2BEE',
        seo_description: 'Scale customer support with AI. Intelligent ticket routing, automated resolution, and improved customer satisfaction.',
        seo_og_image: '/uploads/queen-bee-social.jpg'
      },
      'worker-bee': {
        tagline: 'Work smarter, not harder with AI automation',
        short_description: 'Automate repetitive tasks and streamline workflows with intelligent process automation.',
        long_description: 'Worker Bee is your AI assistant that automates repetitive tasks, manages workflows, and handles data processing. From document processing to data entry, Worker Bee helps your team focus on high-value work while handling the routine tasks efficiently.',
        features: [
          'Document Processing',
          'Data Entry Automation',
          'Workflow Management',
          'Email Automation',
          'Report Generation',
          'Data Validation',
          'Process Monitoring',
          'Integration APIs'
        ],
        integrations: [
          'Microsoft Office 365',
          'Google Workspace',
          'Dropbox',
          'Box',
          'Airtable',
          'Notion',
          'Slack',
          'Microsoft Teams'
        ],
        roi_model: {
          traditional_cost_description: 'Administrative staff cost £25,000+ annually for repetitive tasks that can be automated.',
          assumptions: {
            traditional_admin_cost: 25000,
            traditional_tasks_per_month: 200,
            bee_cost_per_month: 150,
            bee_tasks_per_month: 1000
          }
        },
        faqs: [
          {
            question: 'What types of documents can Worker Bee process?',
            answer: 'Worker Bee can handle invoices, forms, contracts, reports, and any structured or semi-structured documents.'
          },
          {
            question: 'How accurate is the data extraction?',
            answer: 'Worker Bee achieves 95%+ accuracy and flags uncertain data for human review when needed.'
          },
          {
            question: 'Can Worker Bee learn new document formats?',
            answer: 'Yes! Worker Bee can be trained on new document types and adapts to your specific business processes.'
          },
          {
            question: 'What happens if Worker Bee encounters an error?',
            answer: 'Errors are logged and can be reviewed by humans. Worker Bee learns from corrections to improve accuracy.'
          }
        ],
        usage_pricing: {
          USD: {
            usage_type: 'per_document',
            rate_per_unit: '0.25',
            unit_description: 'per document processed'
          },
          GBP: {
            usage_type: 'per_document',
            rate_per_unit: '0.20',
            unit_description: 'per document processed'
          },
          EUR: {
            usage_type: 'per_document',
            rate_per_unit: '0.23',
            unit_description: 'per document processed'
          }
        },
        seo_title: 'Worker Bee - AI Process Automation | B2BEE',
        seo_description: 'Automate repetitive tasks and streamline workflows. Free your team to focus on high-value work.',
        seo_og_image: '/uploads/worker-bee-social.jpg'
      },
      'drone-bee': {
        tagline: 'Collect data insights with AI-powered analytics',
        short_description: 'Transform raw data into actionable insights with intelligent analytics and reporting.',
        long_description: 'Drone Bee is your AI data analyst that collects, processes, and analyzes data to provide actionable business insights. From customer behavior analysis to performance metrics, Drone Bee helps you make data-driven decisions with automated reporting and predictive analytics.',
        features: [
          'Data Collection',
          'Real-time Analytics',
          'Predictive Modeling',
          'Custom Dashboards',
          'Automated Reporting',
          'Data Visualization',
          'Trend Analysis',
          'Alert System'
        ],
        integrations: [
          'Google Analytics',
          'Facebook Ads',
          'LinkedIn Ads',
          'Stripe',
          'Shopify',
          'Salesforce',
          'HubSpot',
          'Zapier'
        ],
        roi_model: {
          traditional_cost_description: 'Data analysts cost £45,000+ annually with limited availability and manual reporting processes.',
          assumptions: {
            traditional_analyst_cost: 45000,
            traditional_reports_per_month: 10,
            bee_cost_per_month: 250,
            bee_reports_per_month: 100
          }
        },
        faqs: [
          {
            question: 'What data sources can Drone Bee connect to?',
            answer: 'Drone Bee can connect to databases, APIs, cloud services, and most business applications through our integration library.'
          },
          {
            question: 'How accurate are the predictive analytics?',
            answer: 'Our models achieve 85%+ accuracy and continuously improve as they learn from new data patterns.'
          },
          {
            question: 'Can I create custom dashboards?',
            answer: 'Yes! Drone Bee offers drag-and-drop dashboard creation with customizable widgets and real-time updates.'
          },
          {
            question: 'How do you ensure data security?',
            answer: 'All data is encrypted in transit and at rest. We follow SOC 2 compliance and never share your data with third parties.'
          }
        ],
        usage_pricing: {
          USD: {
            usage_type: 'per_report',
            rate_per_unit: '1.00',
            unit_description: 'per automated report'
          },
          GBP: {
            usage_type: 'per_report',
            rate_per_unit: '0.80',
            unit_description: 'per automated report'
          },
          EUR: {
            usage_type: 'per_report',
            rate_per_unit: '0.90',
            unit_description: 'per automated report'
          }
        },
        seo_title: 'Drone Bee - AI Data Analytics | B2BEE',
        seo_description: 'Transform data into insights with AI analytics. Automated reporting, predictive modeling, and actionable business intelligence.',
        seo_og_image: '/uploads/drone-bee-social.jpg'
      },
      'guard-bee': {
        tagline: 'Protect your business with AI security monitoring',
        short_description: 'Monitor systems, detect threats, and respond to security incidents with intelligent automation.',
        long_description: 'Guard Bee is your AI security officer that monitors your systems 24/7, detects potential threats, and responds to security incidents automatically. From network monitoring to fraud detection, Guard Bee provides enterprise-level security without the enterprise price tag.',
        features: [
          '24/7 System Monitoring',
          'Threat Detection',
          'Automated Incident Response',
          'Fraud Prevention',
          'Compliance Monitoring',
          'Security Reporting',
          'Alert Management',
          'Integration APIs'
        ],
        integrations: [
          'AWS',
          'Azure',
          'Google Cloud',
          'Slack',
          'Microsoft Teams',
          'PagerDuty',
          'Jira',
          'ServiceNow'
        ],
        roi_model: {
          traditional_cost_description: 'Security analysts cost £60,000+ annually with limited coverage and human error in threat detection.',
          assumptions: {
            traditional_security_cost: 60000,
            traditional_coverage_hours: 40,
            bee_cost_per_month: 500,
            bee_coverage_hours: 168
          }
        },
        faqs: [
          {
            question: 'What types of threats can Guard Bee detect?',
            answer: 'Guard Bee can detect malware, unauthorized access, data breaches, suspicious activities, and compliance violations.'
          },
          {
            question: 'How quickly does Guard Bee respond to threats?',
            answer: 'Guard Bee responds to threats within seconds, automatically blocking suspicious activities and alerting your team.'
          },
          {
            question: 'Can Guard Bee integrate with existing security tools?',
            answer: 'Yes! Guard Bee integrates with most security platforms and can enhance your existing security infrastructure.'
          },
          {
            question: 'What compliance standards does Guard Bee support?',
            answer: 'Guard Bee supports GDPR, SOC 2, PCI DSS, and other major compliance frameworks with automated monitoring and reporting.'
          }
        ],
        usage_pricing: {
          USD: {
            usage_type: 'per_alert',
            rate_per_unit: '0.10',
            unit_description: 'per security alert'
          },
          GBP: {
            usage_type: 'per_alert',
            rate_per_unit: '0.08',
            unit_description: 'per security alert'
          },
          EUR: {
            usage_type: 'per_alert',
            rate_per_unit: '0.09',
            unit_description: 'per security alert'
          }
        },
        seo_title: 'Guard Bee - AI Security Monitoring | B2BEE',
        seo_description: 'Protect your business with AI security. 24/7 monitoring, threat detection, and automated incident response.',
        seo_og_image: '/uploads/guard-bee-social.jpg'
      }
    }

    // Update each bee with sample content
    for (const [slug, data] of Object.entries(sampleData)) {
      console.log(`Updating ${slug}...`)
      
      // Update bee table
      await client.query(
        `UPDATE bees SET 
          tagline = $1,
          short_description = $2,
          long_description = $3,
          features = $4,
          integrations = $5,
          roi_model = $6,
          faqs = $7,
          seo_title = $8,
          seo_description = $9,
          seo_og_image = $10,
          updated_at = NOW()
         WHERE slug = $11`,
        [
          data.tagline,
          data.short_description,
          data.long_description,
          JSON.stringify(data.features),
          JSON.stringify(data.integrations),
          JSON.stringify(data.roi_model),
          JSON.stringify(data.faqs),
          data.seo_title,
          data.seo_description,
          data.seo_og_image,
          slug
        ]
      )

      // Get bee ID for usage pricing
      const beeResult = await client.query('SELECT id FROM bees WHERE slug = $1', [slug])
      const beeId = beeResult.rows[0].id

      // Insert usage pricing
      for (const [currency, pricing] of Object.entries(data.usage_pricing)) {
        await client.query(
          `INSERT INTO bee_usage_pricing (bee_id, currency_code, usage_type, rate_per_unit, unit_description)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (bee_id, currency_code, usage_type) DO UPDATE SET 
           rate_per_unit = EXCLUDED.rate_per_unit, unit_description = EXCLUDED.unit_description`,
          [beeId, currency, pricing.usage_type, pricing.rate_per_unit, pricing.unit_description]
        )
      }

      console.log(`✅ Updated ${slug}`)
    }

    console.log('🎉 Sample content added successfully!')
    
  } catch (error) {
    console.error('Error adding sample content:', error)
  } finally {
    client.release()
    await pool.end()
  }
}

addSampleContent()
