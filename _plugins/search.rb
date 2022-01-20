require 'open3'
require 'date'
require "byebug"

# module Search
#   class Generator < Jekyll::Generator
#     def generate(site)
#       resources = site.collections.
#         values_at("nodes", "lectures").
#         map(&:docs).flatten
#       # cfr https://github.com/jekyll/jekyll-sitemap/blob/99148a2255a2b3a8d2b31ba8216945262981b12c/lib/jekyll/jekyll-sitemap.rb#L57
#       data = Jekyll::PageWithoutAFile.new(site, __dir__, "", "search.json")

#       data.content = resources.map do |resource|
#         [
#           resource.data["slug"],
#           {
#             title: resource.data["title"],
#             content: resource.content,
#           }
#         ]
#       end.to_h.to_json

#       site.pages << data
#     end
#   end
# end

Jekyll::Hooks.register :site, :pre_render do |site|
  resources = site.collections.
    values_at("nodes", "lectures").
    map(&:docs).flatten

  data = resources.map do |resource|
    [
      resource.data["slug"],
      {
        title: resource.data["title"],
        content: resource.content,
      }
    ]
  end.to_h

  # TODO: fix paths
  Pathname.new('search.json').write(data.to_json)
  data = Jekyll::StaticFile.new(site, __dir__, "..", "search.json")
  site.static_files << data
end
