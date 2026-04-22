import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

export type ActionType = 
  | 'role_added' 
  | 'role_removed' 
  | 'profile_updated' 
  | 'ticket_status_changed'
  | 'ticket_priority_changed'
  | 'ticket_assigned'
  | 'medication_created'
  | 'medication_updated'
  | 'medication_deleted'
  | 'blog_published'
  | 'blog_updated'
  | 'blog_deleted'
  | 'settings_updated'
  | 'settings_general_updated'
  | 'settings_notifications_updated'
  | 'settings_security_updated'
  | 'user_created'
  | 'testimonial_created'
  | 'testimonial_updated'
  | 'testimonial_deleted'
  | 'client_viewed'
  | 'client_updated'
  | 'membership_updated';

export type EntityType = 
  | 'user' 
  | 'role' 
  | 'ticket' 
  | 'medication' 
  | 'blog_post' 
  | 'settings'
  | 'testimonial'
  | 'client'
  | 'membership';

interface LogActivityParams {
  actionType: ActionType;
  entityType: EntityType;
  entityId?: string;
  details?: Json;
  previousValue?: Json;
  newValue?: Json;
}

export const useActivityLog = () => {
  const logActivity = async ({
    actionType,
    entityType,
    entityId,
    details,
    previousValue,
    newValue,
  }: LogActivityParams) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.warn('No authenticated user found for activity logging');
        return;
      }

      const { error } = await supabase
        .from('activity_logs')
        .insert([{
          user_id: user.id,
          action_type: actionType,
          entity_type: entityType,
          entity_id: entityId || null,
          details: details || null,
          previous_value: previousValue || null,
          new_value: newValue || null,
        }]);

      if (error) {
        console.error('Error logging activity:', error);
      }
    } catch (error) {
      console.error('Failed to log activity:', error);
    }
  };

  return { logActivity };
};
