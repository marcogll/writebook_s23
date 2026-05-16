module ApplicationHelper
  def hide_from_user_style_tag
    tag.style(<<~CSS.html_safe)
      [data-hide-from-user-id="#{Current.user.id}"] {
        display: none!important;
      }
    CSS
  end

  def custom_styles_tag
    if custom_styles = Current.account&.custom_styles
      tag.style(custom_styles.to_s.html_safe, data: { turbo_track: "reload" })
    end
  end

  def reading_page?
    return false unless signed_in?
    controller_name == "leafables" && action_name == "show" ||
      controller_name == "books" && action_name == "show"
  end

  def content_protection_enabled?
    reading_page?
  end

  def watermark_data
    return nil unless signed_in?
    {
      user_email: Current.user.email_address,
      timestamp: Time.current.strftime("%Y-%m-%d %H:%M"),
      ip: request.remote_ip.to_s.split(".").first(3).join(".") + ".***"
    }
  end
end
