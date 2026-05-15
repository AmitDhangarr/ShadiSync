import GIFT from "../../models/host/gift/gifts.modal.js";
class GuestGiftController {
  static async HandleCreateGiftRegistry(req, res) {
    try {
      const data = req.body;
      const eventId = req.params.eventId;
      const gift = await GIFT.create({
        event_id: eventId,
        ...data,
      });

      if(gift){
        return res.status(201).json({
          success:true,
          data:gift,
          message:"gift has been added",
        });
      }
      if(!gift){
         return res.status(404).json({
          success:false,
          error:"something went wrong while adding gift",
          message:"gift has not been added",
        });
      }

    } catch (error) {
       return res.status(500).json({
          success:false,
          error:error,
          message:"internal server error",
        });
    }
  }
  static async HandlegetGiftRegistry(req, res) {
     try {
      const Id = req.parms.Id;
      const gift = await GIFT.findOne({ _id:Id,
      });

      if(gift){
        return res.status(201).json({
          success:true,
          data:gift,
          message:"gift has been fetched successfully",
        });
      }
      if(!gift){
         return res.status(404).json({
          success:false,
          error:"something went wrong while fetching gift",
          message:"gift has not been fetched",
        });
      }

    } catch (error) {
       return res.status(500).json({
          success:false,
          error:error,
          message:"internal server error",
        });
    }
  }
  static async HandlegetAllGiftRegistry(req, res) {
     try {
      const gift = await GIFT.find({},);

      if(gift){
        return res.status(201).json({
          success:true,
          data:gift,
          message:"gifts have been fetched successfully",
        });
      }
      if(!gift){
         return res.status(404).json({
          success:false,
          error:"something went wrong while fetching gift",
          message:"gifts have not been fetched",
        });
      }

    } catch (error) {
       return res.status(500).json({
          success:false,
          error:error,
          message:"internal server error",
        });
    }
  }
  static async HandleupdateGiftRegistry(req, res) {
     try {
      const data = req.body;
      const eventId = req.params.eventId;
      const gift = await GIFT.create({
        event_id: eventId,
        ...data,
      });

      if(gift){
        return res.status(201).json({
          success:true,
          data:gift,
          message:"gift has been added",
        });
      }
      if(!gift){
         return res.status(404).json({
          success:false,
          error:"something went wrong while adding gift",
          message:"gift has not been added",
        });
      }

    } catch (error) {
       return res.status(500).json({
          success:false,
          error:error,
          message:"internal server error",
        });
    }
  }
  static async HandledeleteGiftRegistry(req, res) {
     try {
      const data = req.body;
      const eventId = req.params.giftId;
      const gift = await GIFT.create({
        event_id: giftId,
        ...data,
      });

      if(gift){
        return res.status(201).json({
          success:true,
          data:gift,
          message:"gift has been added",
        });
      }
      if(!gift){
         return res.status(404).json({
          success:false,
          error:"something went wrong while adding gift",
          message:"gift has not been added",
        });
      }

    } catch (error) {
       return res.status(500).json({
          success:false,
          error:error,
          message:"internal server error",
        });
    }
  }
}

export default GuestGiftController;
