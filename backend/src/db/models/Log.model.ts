import { Schema, model } from "mongoose";
import { WithId } from "mongodb";

// Sub-interfaces for better type organization
export interface LogFile {
	path: string;
}

export interface LogInfo {
	offset?: number;
	file?: LogFile;
}

export interface SourceInfo {
	address?: string;
}

export interface EcsInfo {
	version?: string;
}

export interface HttpResponse {
	status_code?: number;
	body?: any;
}

export interface HttpRequest {
	method?: string;
}

export interface HttpInfo {
	response?: HttpResponse;
	version?: string;
	request?: HttpRequest;
}

export interface UrlInfo {
	original?: string;
}

export interface UserAgent {
	original?: string;
}

export interface AgentInfo {
	name?: string;
	ephemeral_id?: string;
	version?: string;
	type?: string;
	id?: string;
}

export interface EventInfo {
	original?: string;
}

export interface InputInfo {
	type?: string;
}

export interface HostInfo {
	name?: string;
}

export interface LocationMetadata {
	country?: string;
	city?: string;
	latitude?: number;
	longitude?: number;
	timezone?: string;
}

export interface DeviceMetadata {
	browser?: string;
	os?: string;
	type?: string;
	ip?: string;
	userAgent?: string;
}

export interface EnrichedMetadata {
	location?: LocationMetadata;
	device?: DeviceMetadata;
}

export interface OriginalLogData {
	log?: LogInfo;
	source?: SourceInfo;
	tags?: string[];
	ecs?: EcsInfo;
	http?: HttpInfo;
	"@version"?: string;
	url?: UrlInfo;
	agent?: AgentInfo;
	user_agent?: UserAgent;
	message?: string;
	timestamp?: string;
	event?: EventInfo;
	input?: InputInfo;
	"@timestamp"?: Date;
	host?: HostInfo;
}

// Main TypeScript interface for the log entity
export interface LogEntityModel {
	originalLog?: OriginalLogData;
	metadata?: EnrichedMetadata;
	createdAt?: Date;
	updatedAt?: Date;
}

// Type for creating new log documents (without MongoDB _id)
export interface CreateLogData {
	originalLog: OriginalLogData;
	metadata?: EnrichedMetadata;
}

// Type for log documents from database (with MongoDB _id)
export interface LogDocument extends LogEntityModel {
	_id: string;
	createdAt: Date;
	updatedAt: Date;
}

const LogSchema = new Schema<WithId<LogEntityModel>>({
	originalLog: {
		//Основные поля
		log: {
			offset: {
				type: Number,
			},
			file: {
				path: {
					type: String,
				}
			}
		},
		//Источник запроса
		source: {
			address: {
				type: String,
			}
		},
		//Метки и стандарты filebeat
		tags: [{
			type: String
		}],
		//Версия Elastic Common Schema
		ecs: {
			version: {
				type: String,
			}
		},
		//HTTP-запрос
		http: {
			response: {
				status_code: {
					type: Number,
				},
				body: {
					type: Schema.Types.Mixed
				}
			},
			version: {
				type: String,
			},
			request: {
				method: {
					type: String,
				}
			}
		},
		"@version": {
			type: String,
		},
		//URL и агент
		url: {
			original: {
				type: String,
			}
		},
		user_agent: {
			original: {
				type: String,
			}
		},
		//Агент Filebeat
		agent: {
			name: {
				type: String,
			},
			ephemeral_id: {
				type: String,
			},
			version: {
				type: String,
			},
			type: {
				type: String,
			},
			id: {
				type: String,
			}
		},
		//Сырые строки
		message: {
			type: String,
		},
		//Время запроса в формате Nginx
		timestamp: {
			type: String,
		},
		event: {
			original: {
				type: String,
			}
		},
		input: {
			type: {
				type: String,
			}
		},
		//Время в ISO-формате для Elasticsearch
		"@timestamp": {
			type: Date,
		},
		//Хост
		host: {
			name: {
				type: String,
			}
		}
	},
	metadata: {
		location: {
			country: {
				type: String,
			},
			city: {
				type: String,
			},
			latitude: {
				type: Number,
			},
			longitude: {
				type: Number,
			},
			timezone: {
				type: String,
			},
		},
		device: {
			browser: {
				type: String,
			},
			os: {
				type: String,
			},
			type: {
				type: String,
			},
			ip: {
				type: String,
			},
			userAgent: {
				type: String,
			},
		}
	}

}, {
	timestamps: true, // This adds createdAt and updatedAt automatically
	versionKey: false // Removes the __v field
});

// Add indexes for common queries
LogSchema.index({ "@timestamp": -1 }); // For time-based queries
LogSchema.index({ "source.address": 1 }); // For filtering by source IP
LogSchema.index({ "http.response.status_code": 1 }); // For filtering by status code
LogSchema.index({ "agent.name": 1 }); // For filtering by agent
LogSchema.index({ "log.file.path": 1 }); // For filtering by log file

export const LogModel = model<WithId<LogEntityModel>>("logs", LogSchema);