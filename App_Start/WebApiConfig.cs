using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace IsraelPost2
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services

            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "HeroesApi",
                routeTemplate: "api/heroes/{id}",
                defaults: new { controller = "Heroes", id = RouteParameter.Optional }
            );

            config.Routes.MapHttpRoute(
                name: "TrainsApi",
                routeTemplate: "api/trains/{id}",
                defaults: new { controller = "Trains", id = RouteParameter.Optional }
            );
        }
    }
}
