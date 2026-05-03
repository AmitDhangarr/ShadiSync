import EVENT from "../models/host/event/event.modal.js";
import { nanoid } from "nanoid";
class HostEventController {
  static async HandleCreateEvent(req, res) {
   const data = req.body;
   const EventId = nanoid();
   const event = await EVENT.create({
    eventId:EventId,...data
   })
  
   if(event){
     return res.status(200).json({
      success:true,
      message:"event has been created"
     });
   }
   else{
      return res.status(404).json({
      success:false,
      message:"event has been not created"
     });
   }
  
  }
  static async HandleGetEvent(req, res) {
    return res.json("welcome to event");
  }
  static async HandleUpdateEvent(req, res) {
    return res.json("welcome to event");
  }
  static async HandleDeleteEvent(req, res) {
    return res.json("welcome to event");
  }
}

export default HostEventController;