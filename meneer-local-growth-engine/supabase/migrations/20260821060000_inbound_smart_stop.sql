-- Smart stop: lead_status INBOUND na formulier op meneermarketing.nl

alter table public.businesses drop constraint if exists businesses_lead_status_check;
alter table public.businesses add constraint businesses_lead_status_check
  check (lead_status in (
    'DISCOVERED','QUALIFIED','PREVIEW_GENERATING','PREVIEW_READY',
    'READY_FOR_OUTREACH','CONTACTED','REPLIED','INBOUND','MEETING','CLIENT',
    'REJECTED','DO_NOT_CONTACT'
  ));
