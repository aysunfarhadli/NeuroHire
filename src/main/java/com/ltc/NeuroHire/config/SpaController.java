package com.ltc.NeuroHire.config;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Forwards all non-API, non-static routes to index.html so React Router
 * can handle client-side routes like /login, /register, /app/**.
 */
@RestController
public class SpaController {

    @GetMapping(value = {
            "/",
            "/login",
            "/register",
            "/app",
            "/app/**",
            "/jobs",
            "/jobs/**",
            "/companies",
            "/companies/**",
            "/superadmin",
            "/superadmin/**"
    })
    public org.springframework.web.servlet.ModelAndView spa() {
        return new org.springframework.web.servlet.ModelAndView("forward:/index.html");
    }
}
