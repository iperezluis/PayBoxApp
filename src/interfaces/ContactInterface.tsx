export interface PhoneEntry {
  number: string;
  type: string;
}

export interface EmailEntry {
  address: string;
  type: string;
}

export interface AddressEntry {
  formattedAddress: string; // android only
  type: string; // android only
  street: string;
  city: string;
  state: string;
  postalCode: string;
  isoCountryCode: string;
}

export interface Contact {
  name: string;
  phones: PhoneEntry[];
  emails: EmailEntry[];
  postalAddresses: AddressEntry[];
}

export interface ContactPhoneSelection {
  contact: Contact;
  selectedPhone: PhoneEntry;
}

export interface ContactEmailSelection {
  contact: Contact;
  selectedEmail: EmailEntry;
}

export interface ContactPostalAddressSelection {
  contact: Contact;
  selectedAddress: AddressEntry;
}
