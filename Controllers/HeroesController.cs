using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace IsraelPost2.Controllers
{
    public class HeroesController : ApiController
    {
        [HttpGet]
        public HttpResponseMessage Get()
        {
            try
            {
                string json = File.ReadAllText("D:\\מבחן בית\\IsraelPost\\IsraelPost2\\IsraelPost2\\DATA\\Heroes.json");
                JArray heroes = JArray.Parse(json);
                return Request.CreateResponse(HttpStatusCode.OK, heroes);
            }
            catch(Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, ex);
            }
        }
        [HttpPost]
        // POST api/heroes
        public IHttpActionResult Post(JArray heroes)
        {
            try
            {
                string json = heroes.ToString();
                File.WriteAllText("D:\\מבחן בית\\IsraelPost\\IsraelPost2\\IsraelPost2\\DATA\\Heroes.json", json);
                return Ok();
            }
            catch(Exception ex)
            {
                Console.WriteLine("An error occurred: " + ex.Message);
                return InternalServerError();
            }
        }
    }
}
