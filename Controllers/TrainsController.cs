using IsraelPost2.Models;
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
    public class TrainsController : ApiController
    {

        [HttpGet]
        public HttpResponseMessage GetTrainId(string username, string password)
        {
            try
            {
                List<Train> trains = Get();
                int id = trains.ToList().Find(x => x.username == username && x.password == password)?.TrainId ?? -1;
                return Request.CreateResponse(HttpStatusCode.OK, id);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, ex);
            }
        }

        [HttpGet]
        public List<Train> Get()
        {
            try
            {
                string json = File.ReadAllText("D:\\מבחן בית\\IsraelPost\\IsraelPost2\\IsraelPost2\\DATA\\Trains.json");
                JArray trains = JArray.Parse(json);
                List<Train> trainList = new List<Train>();
                foreach (JToken trainToken in trains)
                {
                    Train train = CastToTrain(trainToken);
                    trainList.Add(train);
                }
                return trainList;
            }
            catch (Exception ex)
            {
                Console.WriteLine("An error occurred: " + ex.Message);
                return null;
            }
        }

        public static Train CastToTrain(JToken trainToken)
        {
            try
            {
                int id = (int)trainToken.SelectToken("trainId");
                string username = (string)trainToken.SelectToken("username");
                string password = (string)trainToken.SelectToken("password");
                // create a new Train object and return it
                return new Train { TrainId = id, username = username, password = password };
            }
            catch(Exception ex)
            {
                Console.WriteLine("An error occurred: " + ex.Message);
                return null;
            }
        }
    }
}
