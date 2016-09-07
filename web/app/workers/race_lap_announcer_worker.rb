class RaceLapAnnouncerWorker
  include Sidekiq::Worker
  sidekiq_options retry: false

  def perform(lap_num)

    sfx_file = Soundfile.where(name: "sfx_lap_track_number_#{lap_num}").first
    if sfx_file
      puts "RaceLapAnnouncerWorker::perform: #{lap_num} #{sfx_file.name}"
      Soundfile::play(sfx_file.name)
    end
  end
end
