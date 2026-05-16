
insert into storage.buckets (id, name, public) values ('success-stories', 'success-stories', true) on conflict (id) do nothing;

create policy "Anyone can view success story images"
on storage.objects for select
using (bucket_id = 'success-stories');

create policy "Admins can upload success story images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'success-stories' and has_role(auth.uid(), 'admin'::app_role));

create policy "Admins can update success story images"
on storage.objects for update
to authenticated
using (bucket_id = 'success-stories' and has_role(auth.uid(), 'admin'::app_role));

create policy "Admins can delete success story images"
on storage.objects for delete
to authenticated
using (bucket_id = 'success-stories' and has_role(auth.uid(), 'admin'::app_role));
