export const countries={
  "benin":{iso3:"BEN",m49:"204"},
  "burkina faso":{iso3:"BFA",m49:"854"},
  "côte d'ivoire":{iso3:"CIV",m49:"384"},
  "cote d'ivoire":{iso3:"CIV",m49:"384"},
  "guinea":{iso3:"GIN",m49:"324"},
  "mali":{iso3:"MLI",m49:"466"},
  "nigeria":{iso3:"NGA",m49:"566"},
  "senegal":{iso3:"SEN",m49:"686"},
} as const;

export function countryCodes(name:string){return countries[name.trim().toLowerCase() as keyof typeof countries]??null}
