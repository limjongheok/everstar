package com.everstarbackmain.global.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

import lombok.Getter;

@Configuration
@Getter
public class OpenAiConfig {

	@Value("${openai.model}")
	private String model;

	@Value("${openai.api.url}")
	private String apiUrl;

	@Value("${openai.api.create-image-url}")
	private String createImageUrl;

	@Value("${openai.api.key}")
	private String openAiKey;

	@Bean
	public RestTemplate template() {
		RestTemplate restTemplate = new RestTemplate();
		restTemplate.getInterceptors().add(((request, body, execution) -> {
			request.getHeaders().add("Authorization", "Bearer " + openAiKey);
			return execution.execute(request, body);
		}));
		return restTemplate;
	}
}
