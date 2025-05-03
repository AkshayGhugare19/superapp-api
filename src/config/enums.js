const roles = {
	admin: 'admin',
    consumer: 'consumer',
	merchant:'merchant',
	agent:'agent'
	
};

const userRoles = {
	admin: 'admin',
    consumer: 'consumer',
	merchant:'merchant',
	agent:'agent'
};

const roleAccess = {
	admin: 'adminAccess',
    consumer: 'consumerAccess',
	merchant:'merchantAccess',
	agent:'agentAccess'
}


const socialLoginTypes = {
	Facebook: "facebook",
	Twitter: "twitter",
	Google: "google",
	Apple: "apple",
};



const roleRights = new Map();
roleRights.set(roles.admin, [roleAccess.consumer, roleAccess.merchant,roleAccess.agent]);
roleRights.set(roles.consumer, [roleAccess.consumer]);
roleRights.set(roles.merchant, [roleAccess.merchant]);
roleRights.set(roles.agent, [roleAccess.agent]);


const contentType = {
	applicationJSON: "application/json",			// JSON data
	multipartForm: "multipart/form-data",	// File uploads and forms with files
	formUrlencoded: "application/x-www-form-urlencoded", // Form data encoded as key-value pairs
	textPlain: "text/plain",                        // Plain text data
	textHtml: "text/html",                          // HTML data
	textCsv: "text/csv",                            // CSV data
	applicationXml: "application/xml",              // XML data
	textXml: "text/xml",                            // XML data (text format)
	applicationOctetStream: "application/octet-stream", // Binary data
	applicationPdf: "application/pdf",              // PDF files
	applicationZip: "application/zip",              // ZIP files
}

const otpType = {
	phoneVerify: 'phone_verify',
	emailVerify: 'email_verify',
	forgotPassword: 'forgot_password'
}

const accountType = {
	personal: 'personal',
	business: 'business'
}

const gender = {
	male: 'male',
	female: 'female',
	other: 'other',
}


const socketType = {
	USER_STATUS_UPDATE: "USER_STATUS_UPDATE",
	JOIN_ROOM: "JOIN_ROOM",
	LEAVE_ROOM: "LEAVE_ROOM",
	SENT_MESSAGE: "SENT_MESSAGE",
	RECEIVE_MESSAGE: "RECEIVE_MESSAGE",
	READ_MESSAGE: "READ_MESSAGE",
}

const messageStatus = {
	Sent: "sent",
	Delivered: "delivered",
	Read: "read"
};


const messageTypes = {
	Text: 'text',
	Image: 'image',
	Document: 'document',
	Video: 'video',
  };
  

  const mediaTypes = {
	Image: 'image',
	Audio: 'audio',
	Video: 'video',
  };
  
  const groupType = {
	Private: 'Private',
	Public: 'public'
  };
  

const chatType = {
	OneToOne: 'one-to-one',
	Group: 'Group'
  };

  const participantRole = {
	ADMIN: 'admin',
	USER: 'user',
	VIEWER: 'viewer',
  };

module.exports = {
	roles,
	userRoles,
	roleAccess,
	socialLoginTypes,
	otpType,
	accountType,
	gender,
	socketType,
	messageStatus,
	messageTypes,
	chatType,
	participantRole,
	mediaTypes,
	groupType
};


