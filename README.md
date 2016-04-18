# Zendesk Light Agent Sidebar app

OVERVIEW

- Allows light agents to update key meta-data on a ticket

DEPLOYMENT

- Compress all source files into a ZIP file
- Visit https://jwdavis.zendesk.com/agent/admin/apps/manage
- Click on Upload private app
- Enter a name for the app; e.g. Light Agent Sidebar
- Click Choose File and select your ZIP file
- Click Upload, then click Upload again
- When prompted, enter the subdomain for your Zendesk installation
- For credentials, enter the base64 encoded representation of legitimate Zendesk API credentials (see below)

USE

- As a Light Agent, open a ticket (sidebar only shows on existing tickets)
- Click Apps to show the sidebar apps
- In Light Agent Sidebar, modify fields as appropriate
- Click the Update Ticket button prior to submitting the ticket - this calls the API to actually make the changes

API CONFIG

- If you haven't already, visit https://jwdavis.zendesk.com/agent/admin/api and enable Token Access
- Click add new token and give the token a name
- Create a credentials string comprised of an dedicated account for API access, along with the token; e.g. zd_api@yourdomain.com/token:dVEHKfNCzmHhTRars8FmAqNycuJmgxPGRxVZRdbl
- Base64 encode the entire credentials string and enter; you will use this in the credentials field in sidebar app settings. It will look like this: emRfYXBpQHlvdXJkb21haW4uY29tL3Rva2VuOmRWRUhLZk5Dem1IaFRSYXJzOEZtQXFOeWN1Sm1neFBHUnhWWlJkYmw=. I use the python interpreter on my Mac to do the encoding.