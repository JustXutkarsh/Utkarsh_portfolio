export const homeQuery = `{
  "hero": *[_type == "hero"][0],
  "about": *[_type == "about"][0].body,
  "experience": *[_type == "experience"]|order(orderRank asc),
  "projects": *[_type == "post"]|order(featured desc, created desc){title,slug,imageUrl,mainImage{asset->{_id,url},alt},categories[]->{title},homepage,featured,subcategories[]->{title},created,body,links,summary},
  "skills": *[_type == "skillCategory"]|order(orderRank asc){title,skills},
  "achievements": *[_type == "achievement"]|order(orderRank asc){title,detail,icon,logo,logoPath,metrics[]{label,value,suffix,precision},milestoneDate,milestoneTitle,milestoneDetail},
  "certifications": *[_type == "certification"]|order(orderRank asc){title,issuer,href,image},
  "socials": *[_type == "socialLink"]|order(orderRank asc){label,url}
}`;

export const projectsQuery = `*[_type == "post"]{title,slug,imageUrl,mainImage{asset->{_id,url},alt},categories[]->{title},homepage,featured,subcategories[]->{title},created,body,links,summary}|order(featured desc, created desc)`;

export const projectBySlugQuery = `*[_type == "post" && slug.current == $slug][0]{title,slug,imageUrl,mainImage{asset->{_id,url},alt},categories[]->{title},subcategories[]->{title},featured,created,body,links,summary}`;
